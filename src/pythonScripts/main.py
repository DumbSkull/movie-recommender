import json
import sys
args = sys.argv[1:]  # sys.argv[0] is the directory of this python script

# just for testing the python-shell:

# function to echo back the arguments:


def echo_args(args):
    #a = int(a)
    #b = int(b)
    #c = a+b
    return_to_python_shell(args)


def return_to_python_shell(a):
    print(json.dumps(a))


# Code to execute:
echo_args(args)
