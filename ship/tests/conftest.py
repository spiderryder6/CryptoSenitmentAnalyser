import configparser
import sys
from pathlib import Path

import pytest
from pytest_mock import mocker

sys.path.append(str(Path(__file__).parent.parent))
from analysis import AnalysisManager


@pytest.fixture
def mock_config():
    config = configparser.ConfigParser()
    config.read("config.ini")
    return config


@pytest.fixture
def mock_blob_cli(mocker):
    mock = mocker.Mock()
    mock.list_blobs.return_value = []
    mock.read_blob.return_value = [
        {"title": "Test", "selftext": "Bitcoin is up!", "created": 123456789}
    ]
    return mock


@pytest.fixture
def mock_llm_cli(mocker):
    mock = mocker.Mock()
    mock.chat_with_multiple_messages.return_value = "5000"
    return mock


@pytest.fixture
def mock_mongo_cli(mocker):
    mock = mocker.Mock()
    mock.insert_many_documents.return_value = True
    return mock


@pytest.fixture
def analysis_manager(mock_config, mock_blob_cli, mock_llm_cli, mock_mongo_cli):
    manager = AnalysisManager(mock_config)
    manager.blob_cli = mock_blob_cli
    manager.ds_cli = mock_llm_cli
    manager.mongo_cli = mock_mongo_cli
    return manager
