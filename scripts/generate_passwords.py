import random
import string
import pandas as pd
import csv

file = 'import_users.csv'

def generate_password(length=12):
    characters = string.ascii_letters + string.digits
    password = ''.join(random.choice(characters) for _ in range(length))
    return password

df = pd.read_csv(file,sep=',')

for row in df.index:
    pw = generate_password()
    print(pw)
    df.loc[row,'password'] = pw


df.to_csv(file,sep=",",index=False)
