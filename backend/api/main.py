def add(x, y):
    return x + y

def multiply(x, y):
    return x * y

def subtract(x, y):
    return x - y

def divide(x, y):
    if y == 0:
        raise ValueError("Division by zero error")
    return x / y

if __name__ == "__main__":
    print("2 + 3 =", add(2, 3))
    print("4 * 5 =", multiply(4, 5))
    print("5 - 2 =", subtract(5, 2))
    try:
        print("10 / 2 =", divide(10, 2))
    except ValueError as e:
        print(e)