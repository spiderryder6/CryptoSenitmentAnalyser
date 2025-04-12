import json

# Load posts from a JSON file
with open("reddit_posts.json", "r", encoding="utf-8") as f:
    posts = json.load(f)

categories = {
    "b": "Bearish",
    "n": "Neutral",
    "u": "Bullish",
    "?": "Unclear"
}

for i, post in enumerate(posts):
    if "label" in post:
        continue  # Skip already labeled

    print(f"\nPost {i + 1}/{len(posts)}")
    print(f"Author: {post['author']}")
    print(f"Title: {post['title']}")
    print(f"Body: {post['selftext'] or '[No body]'}")
    print("Label this post as: [b] Bearish, [n] Neutral, [u] Bullish, [?] Unclear")

    while True:
        choice = input("Your label: ").strip().lower()
        if choice in categories:
            posts[i]["label"] = categories[choice]
            break
        else:
            print("Invalid input. Please enter 'b', 'n', 'u', or '?'.")
    
# Save the labeled data
with open("reddit_posts_labeled.json", "w") as f:
    json.dump(posts, f, indent=2)

print("\n✅ All posts labeled. Saved to reddit_posts_labeled.json.")
