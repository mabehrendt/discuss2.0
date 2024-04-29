import string
import pandas as pd
import csv

file = 'import_users.csv'

df = pd.read_csv(file,sep=',',dtype=str)
plattform='https://discuss20.de/accounts/login/?next=/heinrich-heine-universitat-dusseldorf/'
voting='https://discuss20.de/accounts/login/?next=/heinrich-heine-universitat-dusseldorf/projects/module/umfrage'

for row in df.index:
    if df.iloc[row]['gruppe'] == '1':
        link1 = plattform + 'qsubjects/2024-00032/&user='
        link2 = voting + '&user='
    elif df.iloc[row]['gruppe'] == '2':
        link1 = plattform + 'qsubjects/2024-00033/&user='
        link2 = voting + '-2&user='
    elif df.iloc[row]['gruppe'] == '3':
        link1 = plattform + 'ssubjects/2024-00034/&user='
        link2 = voting + '-5&user='
    elif df.iloc[row]['gruppe'] == '4':
        link1 = plattform + 'ssubjects/2024-00035/&user='
        link2 = voting + '-6&user='
    
    link1+=df.iloc[row]['email']+'&pass='+df.iloc[row]['password']
    link2+=df.iloc[row]['email']+'&pass='+df.iloc[row]['password']

    print(link1)
    print(link2) 
    df.loc[row,'link_platform'] = link1
    df.loc[row,'link_voting'] = link2


df.to_csv(file,sep=",",index=False)
