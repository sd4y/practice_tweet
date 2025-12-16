import requests
import time

BASE_URL = "http://localhost:3001"
TIMEOUT = 30

def test_get_all_tweets_should_return_timeline_ordered_newest_first():
    # This test requires authentication to create a tweet (to guarantee at least 2 tweets to verify order)
    # 1. Sign up a new user
    signup_data = {
        "email": f"testuser_{int(time.time())}@example.com",
        "username": f"testuser_{int(time.time())}",
        "password": "TestPassword123!",
        "name": "Test User"
    }
    signup_resp = requests.post(f"{BASE_URL}/auth/signup", json=signup_data, timeout=TIMEOUT)
    assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"

    # 2. Login to obtain JWT token
    login_data = {
        "email": signup_data["email"],
        "password": signup_data["password"]
    }
    login_resp = requests.post(f"{BASE_URL}/auth/login", json=login_data, timeout=TIMEOUT)
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"

    login_json = login_resp.json()
    token = login_json.get("access_token")
    assert token, f"No token returned on login: {login_resp.text}"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # 3. Create two tweets with different timestamps to verify ordering
    tweet_ids = []
    try:
        tweet1_data = {"text": "First tweet for ordering test"}
        tweet1_resp = requests.post(f"{BASE_URL}/tweets", json=tweet1_data, headers=headers, timeout=TIMEOUT)
        assert tweet1_resp.status_code == 201, f"Failed to create first tweet: {tweet1_resp.text}"
        tweet1_id = tweet1_resp.json().get("id")
        assert tweet1_id, "No tweet id returned for first tweet"
        tweet_ids.append(tweet1_id)
        time.sleep(1)  # Ensure different timestamp

        tweet2_data = {"text": "Second tweet for ordering test"}
        tweet2_resp = requests.post(f"{BASE_URL}/tweets", json=tweet2_data, headers=headers, timeout=TIMEOUT)
        assert tweet2_resp.status_code == 201, f"Failed to create second tweet: {tweet2_resp.text}"
        tweet2_id = tweet2_resp.json().get("id")
        assert tweet2_id, "No tweet id returned for second tweet"
        tweet_ids.append(tweet2_id)

        # 4. Fetch all tweets
        get_tweets_resp = requests.get(f"{BASE_URL}/tweets", headers=headers, timeout=TIMEOUT)
        assert get_tweets_resp.status_code == 200, f"Failed to get tweets: {get_tweets_resp.text}"
        tweets = get_tweets_resp.json()
        assert isinstance(tweets, list), "Tweets response is not a list"

        # 5. Check that tweets are ordered newest first by comparing timestamps or order of tweet ids
        # Here we check that tweet2 appears before tweet1 in the list
        ids_in_response = [tweet.get("id") for tweet in tweets if tweet.get("id") in tweet_ids]
        # tweet2_id should come before tweet1_id for newest first ordering
        assert tweet2_id in ids_in_response and tweet1_id in ids_in_response, "Test tweets not found in timeline"
        assert ids_in_response.index(tweet2_id) < ids_in_response.index(tweet1_id), \
            "Tweets are not ordered newest first"

    finally:
        # Cleanup: delete created tweets
        for tid in tweet_ids:
            requests.delete(f"{BASE_URL}/tweets/{tid}", headers=headers, timeout=TIMEOUT)
        # Ideally delete user as well, but no user deletion endpoint specified


test_get_all_tweets_should_return_timeline_ordered_newest_first()
