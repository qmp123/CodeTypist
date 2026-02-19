export const practiceData = {
  Python: {
    "짧은 코드 연습": [
      'print("Hello, Python World!")', 'import pandas as pd\ndf = pd.read_csv("data.csv")',
      'import numpy as np\narr = np.array([1, 2, 3])', 'for i in range(5):\n    print(i)',
      'def hello():\n    return "Hi"', 'import os\nprint(os.getcwd())',
      'x = [i for i in range(10)]', 'if x > 10:\n    print("Large")',
      'with open("test.txt", "r") as f:\n    lines = f.readlines()', 'import matplotlib.pyplot as plt\nplt.show()',
      'try:\n    val = 10 / 0\nexcept ZeroDivisionError: pass', 'my_dict = {"name": "AI", "age": 5}',
      'a, b = 5, 10\na, b = b, a', 'import random\nnum = random.randint(1, 100)',
      'text = "  Python  "\nprint(text.strip())', 'import datetime\nprint(datetime.datetime.now())',
      'numbers = [1, 2, 3]\nnumbers.append(4)', 'import time\ntime.sleep(2)',
      'df = pd.DataFrame({"A": [1, 2, 3]})', 'import math\nprint(math.pi)',
      'def add(a, b):\n    return a + b', 'import sys\nprint(sys.argv)',
      'import json\ndata = json.loads("{}")', 'while True:\n    break',
      'print(f"Total: {10 + 20}")', 's = "apple,banana"\nlist = s.split(",")',
      'import requests\n# response = requests.get(url)', 'arr = np.zeros((3, 3))',
      'print(len([1, 2, 3]))', 'items = ["a", "b"]\nfor item in items: print(item)'
    ],
    '긴 코드 연습': ['for i in range(10): print(i)', 'if __name__ == "__main__":'],
    '코드 게임': ['import random', 'def game_start():', 'print("Game Over")'],
  },
  Java: {
    '짧은 코드 연습': ['System.out.println("Hi");', 'public static void main', 'int x = 10;'],
    '긴 코드 연습': ['public class HelloWorld {', 'String[] args'],
    '코드 게임': ['ArrayList<String> list = new ArrayList<>();'],
  },
  C: {
    '짧은 코드 연습': ['#include <stdio.h>', 'int main(void) {', 'printf("Hello");'],
    '긴 코드 연습': ['int a = 10; int b = 20;', 'return 0;'],
    '코드 게임': ['char str[100];', 'scanf("%d", &n);'],
  }
};