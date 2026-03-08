#!/bin/bash

# Simple Interest Calculator
# Formula: Simple Interest = (Principal × Rate × Time) / 100
# 
# This script is part of the Health Tracker project
# Repository: https://github.com/ihsansajid001-hub/Health_Tracker

echo "=================================="
echo "   Simple Interest Calculator"
echo "=================================="
echo ""

# Function to validate if input is a number
validate_number() {
    if ! [[ $1 =~ ^[0-9]+\.?[0-9]*$ ]]; then
        echo "Error: Please enter a valid number"
        exit 1
    fi
}

# Get Principal Amount
echo "Enter the Principal Amount (e.g., 1000):"
read principal

# Validate principal
validate_number "$principal"

# Get Rate of Interest
echo "Enter the Rate of Interest per year (e.g., 5 for 5%):"
read rate

# Validate rate
validate_number "$rate"

# Get Time Period
echo "Enter the Time Period in years (e.g., 2):"
read time

# Validate time
validate_number "$time"

echo ""
echo "=================================="
echo "   Calculating..."
echo "=================================="
echo ""

# Calculate Simple Interest
# Formula: SI = (P × R × T) / 100
simple_interest=$(echo "scale=2; ($principal * $rate * $time) / 100" | bc)

# Calculate Total Amount
# Formula: Total = Principal + Simple Interest
total_amount=$(echo "scale=2; $principal + $simple_interest" | bc)

# Display Results
echo "📊 CALCULATION RESULTS:"
echo "=================================="
echo "Principal Amount:    \$$principal"
echo "Rate of Interest:    $rate% per year"
echo "Time Period:         $time years"
echo "--------------------------------"
echo "Simple Interest:     \$$simple_interest"
echo "Total Amount:        \$$total_amount"
echo "=================================="
echo ""
echo "Formula Used: SI = (P × R × T) / 100"
echo "Where P = Principal, R = Rate, T = Time"
echo ""
echo "✅ Calculation Complete!"
