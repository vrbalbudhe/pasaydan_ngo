import matplotlib.pyplot as plt

# Data from the output
array_numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
regular_times = [400, 600, 700, 500, 500, 500, 300, 300, 700, 700]  # in nanoseconds
divide_conquer_times = [1200, 2100, 1900, 1500, 1600, 1400, 1300, 1300, 1500, 1900]  # in nanoseconds

# Create the plot
plt.figure(figsize=(10, 6))

# Plot Regular Method
plt.plot(array_numbers, regular_times, marker='o', label='Regular Min-Max', color='blue', linestyle='-', linewidth=2)

# Plot Divide and Conquer Method
plt.plot(array_numbers, divide_conquer_times, marker='s', label='Divide & Conquer Min-Max', color='red', linestyle='-', linewidth=2)

# Adding labels and title
plt.title('Comparison of Regular vs Divide & Conquer Min-Max', fontsize=16)
plt.xlabel('Array Size', fontsize=14)
plt.ylabel('Time Taken (nanoseconds)', fontsize=14)
plt.xticks(array_numbers)
plt.grid(True, linestyle='--', alpha=0.6)

# Adding a legend
plt.legend(fontsize=12)

# Show the plot
plt.show()
