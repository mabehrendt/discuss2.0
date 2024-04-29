import string
import pandas as pd
import csv

file = 'import_users.csv'

df = pd.read_csv(file,sep=',',dtype=str)

for row in df.index:
    mail = df.iloc[row]['username'] + str(df.iloc[row]['gruppe']) + '@hhu.de'
    print(mail) 
    df.loc[row,'email'] = mail


df.to_csv(file,sep=",",index=False)
