import configparser

from analysis import AnalysisManager

config = configparser.ConfigParser()
config.read("config.ini")

manager = AnalysisManager(config)

prefix = "posts"
manager.analyze_sentiment(prefix)

print("Goodbye :)")
