import random
import datetime
import os
import re
import feedparser
import time

def extract_potential_buzzwords(text):
    """Extract potential buzzwords from text."""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    
    # Look for capitalized terms that might be buzzwords (1-3 words)
    buzzword_pattern = r'\b([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+){0,2})\b'
    capitalized_terms = re.findall(buzzword_pattern, text)
    
    # Also look for tech terms that might be lowercase
    tech_terms = ["artificial intelligence", "machine learning", "big data", 
                 "cloud computing", "internet of things", "blockchain", 
                 "digital transformation", "cybersecurity", "data science",
                 "virtual reality", "augmented reality", "quantum computing"]
    
    # Look for these terms in the text
    found_tech_terms = []
    for term in tech_terms:
        if re.search(r'\b' + re.escape(term) + r'\b', text.lower()):
            # Capitalize properly
            found_tech_terms.append(' '.join(word.capitalize() for word in term.split()))
    
    return capitalized_terms + found_tech_terms

def is_valid_buzzword(word):
    """Check if a word is likely to be a valid buzzword."""
    # Words to exclude
    excluded_words = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
        "January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December", "Today", "Yesterday", "Tomorrow",
        "America", "China", "Russia", "Europe", "Africa", "Asia",
        "Washington", "Report", "Story", "Article", "Post", "News", "Media", "Photo", 
        "Video", "People", "Person", "Company", "Business"
    ]
    
    # Company names to exclude
    companies = ["Google", "Microsoft", "Amazon", "Apple", "Facebook", "Meta", 
                "Twitter", "LinkedIn", "Uber", "Airbnb", "Netflix", "Spotify"]
    
    # Check exclusions
    if any(excl.lower() == word.lower() for excl in excluded_words + companies):
        return False
    
    # Check word length (too short or too long)
    if len(word) < 4 or len(word) > 30:
        return False
    
    # No digits
    if any(c.isdigit() for c in word):
        return False
        
    return True

def get_fallback_buzzwords():
    """Return a list of reliable buzzwords as fallback."""
    return [
        "Synergy", "Big Data", "Machine Learning", "Artificial Intelligence", 
        "Blockchain", "Cloud Computing", "Digital Transformation", "Internet of Things",
        "Agile", "DevOps", "Scalability", "Leverage", "Paradigm Shift", "Disruption",
        "Innovation", "Ecosystem", "Low-Hanging Fruit", "Bandwidth", "ROI", "KPI",
        "Actionable Insights", "Growth Hacking", "Lean", "MVP", "Deep Dive",
        "Move the Needle", "Thought Leadership", "Best Practices", "Core Competency",
        "Circle Back", "Touch Base", "Web3", "Metaverse", "NFTs", "Crypto",
        "5G", "Edge Computing", "Hyperautomation", "Quantum Computing", "Cybersecurity",
        "Zero Trust", "Immersive Experience", "Customer-Centric", "Data-Driven",
        "SaaS", "PaaS", "IaaS", "Microservices", "Containerization", "Serverless"
    ]

def get_buzzwords_from_rss():
    """Get buzzwords from tech RSS feeds."""
    # List of tech RSS feeds (mostly reliable)
    rss_feeds = [
        "https://feeds.feedburner.com/TechCrunch/",
        "https://www.wired.com/feed/rss",
        "https://www.theverge.com/rss/index.xml",
        "https://www.technologyreview.com/feed/",
        "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
        "https://www.zdnet.com/news/rss.xml",
        "https://www.computerworld.com/index.rss",
        "https://feeds.arstechnica.com/arstechnica/technology-lab",
    ]
    
    all_text = ""
    potential_buzzwords = []
    
    print("Fetching tech RSS feeds...")
    
    for feed_url in rss_feeds:
        try:
            print(f"Fetching: {feed_url}")
            feed = feedparser.parse(feed_url)
            
            # Check if feed was successfully fetched
            if feed.get('status', 0) == 200 or 'entries' in feed:
                # Process each entry
                for entry in feed.entries[:10]:  # Process up to 10 entries per feed
                    # Collect text from title and description
                    title = entry.get('title', '')
                    description = entry.get('description', '')
                    
                    # Extract potential buzzwords
                    potential_buzzwords.extend(extract_potential_buzzwords(title))
                    potential_buzzwords.extend(extract_potential_buzzwords(description))
                
                print(f"Processed {min(10, len(feed.entries))} articles from {feed_url}")
            else:
                print(f"Failed to fetch {feed_url}")
                
        except Exception as e:
            print(f"Error processing {feed_url}: {e}")
        
        # Add a short delay
        time.sleep(1)
    
    # Filter buzzwords
    filtered_buzzwords = []
    for word in potential_buzzwords:
        if is_valid_buzzword(word):
            filtered_buzzwords.append(word)
    
    # Count occurrences to find most common
    buzzword_counts = {}
    for word in filtered_buzzwords:
        buzzword_counts[word] = buzzword_counts.get(word, 0) + 1
    
    # Sort by frequency
    sorted_buzzwords = sorted(buzzword_counts.items(), key=lambda x: x[1], reverse=True)
    top_buzzwords = [word for word, count in sorted_buzzwords[:50]]
    
    # If we didn't find enough, use fallback
    if len(top_buzzwords) < 50:
        fallback = get_fallback_buzzwords()
        remaining = 50 - len(top_buzzwords)
        
        # Add fallbacks that aren't already in the list
        for word in fallback:
            if word not in top_buzzwords and remaining > 0:
                top_buzzwords.append(word)
                remaining -= 1
    
    return top_buzzwords[:50]

def save_buzzwords(buzzwords, filename="buzzwords.txt"):
    """Save buzzwords to a file."""
    with open(filename, "w", encoding="utf-8") as file:
        for word in sorted(buzzwords):
            file.write(word + "\n")
    print(f"Saved {len(buzzwords)} buzzwords to {filename}")

def check_if_update_needed(filename="buzzwords.txt", days=7):
    """Check if the file needs updating (older than specified days)."""
    if not os.path.exists(filename):
        return True
    
    file_time = os.path.getmtime(filename)
    file_date = datetime.datetime.fromtimestamp(file_time)
    current_date = datetime.datetime.now()
    
    # Calculate difference in days
    diff = current_date - file_date
    return diff.days >= days

def main():
    """Main function to update buzzwords if needed."""
    # Check if we need to update
    if check_if_update_needed(days=7):  # Update weekly
        print("Buzzwords file needs updating...")
        try:
            # Try to get buzzwords from RSS
            buzzwords = get_buzzwords_from_rss()
            save_buzzwords(buzzwords)
            print("Successfully updated buzzwords from RSS feeds.")
        except Exception as e:
            print(f"Error updating from RSS: {e}")
            # Fallback to reliable buzzwords
            print("Using fallback buzzwords list.")
            buzzwords = get_fallback_buzzwords()
            save_buzzwords(buzzwords)
    else:
        print("Buzzwords file is current (less than 7 days old).")
        # Load existing buzzwords
        with open("buzzwords.txt", "r", encoding="utf-8") as file:
            buzzwords = [line.strip() for line in file if line.strip()]
    
    # Print current buzzwords
    print("\nCurrent Buzzwords:")
    for i, word in enumerate(sorted(buzzwords), 1):
        print(f"{i}. {word}")

if __name__ == "__main__":
    main()