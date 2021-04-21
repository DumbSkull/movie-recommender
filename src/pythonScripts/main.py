import json
import sys
import os
import pandas as pd

args = sys.argv[1:]  # sys.argv[0] is the directory of this python script

# cwd is the current directory
cwd = os.path.dirname(os.path.realpath(sys.argv[0]))

# C:/Users/jerin/Desktop/Jerin/Coding/Projects/movie-recommender/src/pythonScripts
similarityDf = pd.read_json(
    cwd + "\\movielensDataset\\correlation_matrix.json")


def echo_args(df):
    result = df.to_json(orient="records")
    parsed = json.loads(result)
    return_to_python_shell(parsed)


def return_to_python_shell(a):
    print(json.dumps(a))


# Function which extracts the correlation of a movie from the similarity matrix and returns it
def getSimilarMovies(movieName):
    # This is used to make the correlation value ranging from 0-100
    similar_score = (similarityDf[movieName] + 1) * 50
    similar_score = similar_score.sort_values(ascending=False)
    return similar_score


# Here selection list is the user input for preferred movies
selection = args

input_length = len(selection)

movie_similarity = pd.DataFrame()

# Iterating through every movie in the user list and running the function to obtain its correlation array
for movie in selection:
    movie_dict = json.loads(movie)
    movie_similarity = movie_similarity.append(
        getSimilarMovies(movie_dict['title']), ignore_index=False)

# Adding the values of the correlation array for every movie and sorting in descending order to obtain the final result
movie_similarity = movie_similarity.sum().sort_values(ascending=False)

# Obtaining the average value after the summation
movie_similarity = movie_similarity / input_length

movie_similarity = movie_similarity.to_frame().reset_index().round(2)
movie_similarity = movie_similarity.rename(
    columns={'index': 'title', 0: 'correlation'})

# Code to execute:
echo_args(movie_similarity.head(10))
