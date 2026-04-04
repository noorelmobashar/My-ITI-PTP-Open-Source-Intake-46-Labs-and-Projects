locations = map(lambda x: f'{x[0]} ' if x[1] == 'i' else "", enumerate(input()))
print(*locations, sep="")