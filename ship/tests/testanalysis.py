import configparser
import sys
from pathlib import Path
from unittest.mock import Mock

import pytest

sys.path.append(str(Path(__file__).parent.parent))
from analysis import AnalysisManager


def test_analyze_sentiment_happy_path(
    analysis_manager, mock_blob_cli, mock_llm_cli, mock_mongo_cli
):
    mock_blob = Mock()
    mock_blob.name = "posts_123"

    mock_blob_cli.list_blobs.return_value = [mock_blob]
    # Execute
    analysis_manager.analyze_sentiment("posts")

    # Assertions
    mock_llm_cli.chat_with_multiple_messages.assert_called()
    mock_mongo_cli.insert_many_documents.assert_called_with(
        [{"score": 5000, "created": 123456789}]
    )
    mock_blob_cli.delete_blob.assert_called()


def test_analyze_sentiment_empty_blobs(analysis_manager, mock_blob_cli):
    # Setup: No blobs found
    mock_blob_cli.list_blobs.return_value = []

    # Execute
    analysis_manager.analyze_sentiment("posts")

    # Assertion
    mock_blob_cli.read_blob.assert_not_called()


def test_analyze_sentiment_malformed_llm_response(
    analysis_manager, mock_blob_cli, mock_llm_cli
):
    mock_blob = Mock()
    mock_blob.name = "posts_123"  # Must be at least 5 chars long for the slice

    mock_blob_cli.list_blobs.return_value = [mock_blob]
    # Setup: LLM returns invalid response
    mock_llm_cli.chat_with_multiple_messages.return_value = "invalid,response"

    # Execute/Assert
    with pytest.raises(ValueError):
        analysis_manager.analyze_sentiment("posts")


def test_write_sentiment_mismatched_lengths(analysis_manager, mock_mongo_cli):
    # Setup: Scores and timestamps don't match
    scores = [5000, 7000]
    timestamps = [123456789]  # Missing one timestamp

    # Execute
    analysis_manager.write_sentiment(scores, timestamps)

    # Assertion: Only one document inserted
    mock_mongo_cli.insert_many_documents.assert_called_with(
        [{"score": 5000, "created": 123456789}]
    )


def test_send_to_chat_clean_response(analysis_manager, mock_llm_cli):
    # Setup: LLM response with newlines/spaces
    mock_llm_cli.chat_with_multiple_messages.return_value = "5000, 7000\n"

    # Execute
    result = analysis_manager.send_to_chat(["dummy query", "text"])

    # Assertion
    assert result == ["5000", "7000"]


def test_delete_blobs_error_handling(analysis_manager, mock_blob_cli):
    # Setup: Blob deletion fails once
    mock_blob_cli.delete_blob.side_effect = [Exception("Failed"), None]

    # Execute (should not raise)
    analysis_manager.delete_blobs(["blob1", "blob2"])

    # Assertion: Both attempts made
    assert mock_blob_cli.delete_blob.call_count == 2


def test_analyze_sentiment_partial_batch(analysis_manager, mock_blob_cli, mock_llm_cli):
    """Test when number of posts isn't a multiple of 10 (partial batch)"""
    mock_blob = Mock()
    mock_blob.name = "posts_123"
    mock_blob_cli.list_blobs.return_value = [mock_blob]
    mock_blob_cli.read_blob.return_value = [
        {"title": "Test", "selftext": "Content", "created": 123}
    ] * 13  # 13 posts

    analysis_manager.analyze_sentiment("posts")

    # Should make 2 calls - one for 10 posts, one for 3
    assert mock_llm_cli.chat_with_multiple_messages.call_count == 2


def test_send_to_chat_empty_response(analysis_manager, mock_llm_cli):
    """Test handling empty response from LLM"""
    mock_llm_cli.chat_with_multiple_messages.return_value = ""

    with pytest.raises(ValueError):
        analysis_manager.send_to_chat(["query"])


def test_write_sentiment_empty_data(analysis_manager, mock_mongo_cli):
    """Test writing empty sentiment data"""
    analysis_manager.write_sentiment([], [])
    mock_mongo_cli.insert_many_documents.assert_not_called()


def test_write_sentiment_db_failure(analysis_manager, mock_mongo_cli):
    """Test database write failure"""
    mock_mongo_cli.insert_many_documents.side_effect = Exception("DB error")

    with pytest.raises(Exception):
        analysis_manager.write_sentiment([5000], [123456789])


def test_missing_config_sections():
    """Test initialization with invalid config"""
    bad_config = configparser.ConfigParser()
    with pytest.raises(IndexError):
        AnalysisManager(bad_config)


def test_analyze_sentiment_invalid_blob_content(analysis_manager, mock_blob_cli):
    """Test handling invalid blob content"""
    mock_blob = Mock()
    mock_blob.name = "posts_123"
    mock_blob_cli.list_blobs.return_value = [mock_blob]
    mock_blob_cli.read_blob.return_value = [
        {"invalid": "data"}
    ]  # Missing required fields

    with pytest.raises(KeyError):
        analysis_manager.analyze_sentiment("posts")


def test_analyze_sentiment_blob_read_failure(analysis_manager, mock_blob_cli):
    """Test handling blob read failures"""
    mock_blob = Mock()
    mock_blob.name = "posts_123"
    mock_blob_cli.list_blobs.return_value = [mock_blob]
    mock_blob_cli.read_blob.side_effect = Exception("Read failed")

    with pytest.raises(Exception):
        analysis_manager.analyze_sentiment("posts")


@pytest.mark.timeout(5)  # Fail if test takes longer than 5 seconds
def test_large_volume_processing(analysis_manager, mock_blob_cli, mock_llm_cli):
    """Test processing large volume of posts"""
    mock_blob = Mock()
    mock_blob.name = "posts_123"
    mock_blob_cli.list_blobs.return_value = [mock_blob]
    mock_blob_cli.read_blob.return_value = [
        {"title": "Test", "selftext": "Content", "created": 123}
    ] * 1000

    analysis_manager.analyze_sentiment("posts")

    assert mock_llm_cli.chat_with_multiple_messages.call_count == 99


def test_invalid_sentiment_scores(analysis_manager, mock_llm_cli):
    """Test handling invalid score values"""
    mock_llm_cli.chat_with_multiple_messages.return_value = "10001,-2,abc"

    with pytest.raises(ValueError):
        analysis_manager.send_to_chat(["query"])
