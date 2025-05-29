import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))
from src.backend.api.main import add, multiply, subtract, divide

class TestMathOperations:
    
    def test_add_positive_numbers(self):
        assert add(2, 3) == 5
        assert add(10, 15) == 25
    
    def test_add_negative_numbers(self):
        assert add(-2, -3) == -5
        assert add(-10, 5) == -5
    
    def test_add_with_zero(self):
        assert add(0, 5) == 5
        assert add(5, 0) == 5
        assert add(0, 0) == 0
    
    def test_multiply_positive_numbers(self):
        assert multiply(4, 5) == 20
        assert multiply(3, 7) == 21
    
    def test_multiply_negative_numbers(self):
        assert multiply(-2, 3) == -6
        assert multiply(-2, -3) == 6
    
    def test_multiply_with_zero(self):
        assert multiply(0, 5) == 0
        assert multiply(5, 0) == 0
        assert multiply(0, 0) == 0
    
    def test_subtract_positive_numbers(self):
        assert subtract(5, 2) == 3
        assert subtract(10, 3) == 7
    
    def test_subtract_negative_numbers(self):
        assert subtract(-5, -2) == -3
        assert subtract(-2, -5) == 3
    
    def test_subtract_with_zero(self):
        assert subtract(5, 0) == 5
        assert subtract(0, 5) == -5
        assert subtract(0, 0) == 0
    
    def test_divide_positive_numbers(self):
        assert int(divide(10, 2)) == 5
        assert int(divide(15, 3)) == 5
    
    def test_divide_negative_numbers(self):
        assert int(divide(-10, 2)) == -5
        assert int(divide(-10, -2)) == 5
    
    def test_divide_by_zero_raises_error(self):
        with pytest.raises(ValueError, match="Division by zero error"):
            divide(10, 0)
        
        with pytest.raises(ValueError, match="Division by zero error"):
            divide(-5, 0)
    
    def test_divide_zero_by_number(self):
        assert int(divide(0, 5)) == 0
        assert int(divide(0, -3)) == 0