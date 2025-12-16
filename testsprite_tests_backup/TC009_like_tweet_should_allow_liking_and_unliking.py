import requests
import uuid

BASE_URL = "http://localhost:3001"
TIMEOUT = 30

def signup_user(email, username, password, name):
    url = f"{BASE_URL}/auth/signup"
    payload = {
        "email": email,
        "username": username,
        "password": password,
        "name": name
    }
    resp = requests.post(url, json=payload, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()

def login_user(email, password):
    url = f"{BASE_URL}/auth/login"
    payload = {
        "email": email,
        "password": password
    }
    resp = requests.post(url, json=payload, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()

def create_tweet(token, text):
    url = f"{BASE_URL}/tweets"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    payload = {
        "text": text
    }
    resp = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()

def delete_tweet(tweet_id, token):
    url = f"{BASE_URL}/tweets/{tweet_id}"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    resp = requests.delete(url, headers=headers, timeout=TIMEOUT)
    # Accept 200 or 204 for delete success
    if resp.status_code not in (200, 204):
        resp.raise_for_status()

def like_tweet(tweet_id, token):
    url = f"{BASE_URL}/tweets/{tweet_id}/like"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    resp = requests.post(url, headers=headers, timeout=TIMEOUT)
    return resp

def unlike_tweet(tweet_id, token):
    url = f"{BASE_URL}/tweets/{tweet_id}/like"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    resp = requests.delete(url, headers=headers, timeout=TIMEOUT)
    return resp

def test_like_tweet_should_allow_liking_and_unliking():
    # Create unique user for test
    test_email = f"user_{uuid.uuid4().hex}@example.com"
    test_username = f"user_{uuid.uuid4().hex[:8]}"
    test_password = "StrongPass!123"
    test_name = "Test User"
    
    user_signup_resp = signup_user(test_email, test_username, test_password, test_name)
    assert "accessToken" in user_signup_resp, "Signup should return an accessToken"
    token = user_signup_resp["accessToken"]
    assert token, "JWT token must be present after signup"

    # Also verify login works (optional)
    login_resp = login_user(test_email, test_password)
    assert "accessToken" in login_resp, "Login should return an accessToken"

    tweet = None
    try:
        tweet = create_tweet(token, "Test tweet for like/unlike functionality.")
        assert "id" in tweet, "Creating tweet should return tweet with id"
        tweet_id = tweet["id"]

        # Like the tweet
        like_resp = like_tweet(tweet_id, token)
        assert like_resp.status_code == 200, f"Liking tweet failed with status {like_resp.status_code}"
        
        # Verify like response content if applicable
        if like_resp.headers.get("Content-Type", "").startswith("application/json"):
            like_data = like_resp.json()
            assert isinstance(like_data, dict), "Like response should be a JSON object"

        # Unlike the tweet
        unlike_resp = unlike_tweet(tweet_id, token)
        assert unlike_resp.status_code == 200, f"Unliking tweet failed with status {unlike_resp.status_code}"
        
        # Verify unlike response content if applicable
        if unlike_resp.headers.get("Content-Type", "").startswith("application/json"):
            unlike_data = unlike_resp.json()
            assert isinstance(unlike_data, dict), "Unlike response should be a JSON object"
            
    finally:
        if tweet and "id" in tweet:
            try:
                delete_tweet(tweet["id"], token)
            except Exception:
                # Cleanup failure is non-fatal to test outcome
                pass

test_like_tweet_should_allow_liking_and_unliking()
