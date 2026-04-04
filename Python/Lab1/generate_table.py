n = int(input())
res = []

for i in range(1, n+1):
    step = []
    for j in range(1, i+1):
        step.append(i*j)
    res.append(step)

print(res)