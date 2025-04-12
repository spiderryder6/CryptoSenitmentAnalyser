import json

# Load JSON files
with open("reddit_posts_labeled.json", "r", encoding="utf-8") as f:
    manual_data = json.load(f)

with open("sentiment_output.json", "r", encoding="utf-8") as f:
    model_data = json.load(f)

# Basic check
if len(manual_data) != len(model_data):
    print(
        f"File lengths do not match! Manual: {len(manual_data)}, Model: {len(model_data)}"
    )
    exit()


# Score to category mapping function
def map_score_to_label(score: int) -> str:
    if score == -1:
        return "unclear"
    elif score <= 3300:
        return "bearish"
    elif score <= 6699:
        return "neutral"
    else:
        return "bullish"


# Compare
match_count = 0
mismatches = []

for i, (manual_post, model_post) in enumerate(zip(manual_data, model_data)):
    manual_label = manual_post.get("label", "").lower()
    score = model_post.get("score", -1)
    model_label = map_score_to_label(score)

    if manual_label == model_label:
        match_count += 1
    else:
        mismatches.append(
            {
                "index": i,
                "title": manual_post.get("title", "[No title]"),
                "manual": manual_label,
                "model": model_label,
                "score": score,
            }
        )

# Summary
total = len(manual_data)
accuracy = match_count / total * 100

print(f"\n✅ Total Posts Compared: {total}")
print(f"✅ Matching Labels: {match_count}")
print(f"❌ Mismatches: {len(mismatches)}")
print(f"📊 Agreement Rate: {accuracy:.2f}%\n")

# Details
if mismatches:
    print("🔍 Mismatched Posts:")
    for m in mismatches:
        print(
            f"[{m['index']}] \"{m['title']}\"\n  Manual: {m['manual']} | Model: {m['model']} (Score: {m['score']})\n"
        )
