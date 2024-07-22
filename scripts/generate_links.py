import string
import pandas as pd
import csv

file = 'import_users.csv'

df = pd.read_csv(file,sep=',',dtype=str)
plattform='https://discuss20.de/accounts/login/?next=/heinrich-heine-universitat-dusseldorf/'
voting='https://discuss20.de/accounts/login/?next=/heinrich-heine-universitat-dusseldorf/projects/module/umfrage'

for row in df.index:
    if df.iloc[row]['gruppe'] == '1':
        link1 = plattform + 'ssubjects/2024-00067/&user='
        link2 = voting + '&user='
    elif df.iloc[row]['gruppe'] == '2':
        link1 = plattform + 'ssubjects/2024-00068/&user='
        link2 = voting + '-2&user='
    elif df.iloc[row]['gruppe'] == '3':
        link1 = plattform + 'ssubjects/2024-00069/&user='
        link2 = voting + '-3&user='
    elif df.iloc[row]['gruppe'] == '4':
        link1 = plattform + 'srsubjects/2024-00070/&user='
        link2 = voting + '-4&user='
    elif df.iloc[row]['gruppe'] == '5':
        link1 = plattform + 'srsubjects/2024-00071/&user='
        link2 = voting + '-5&user='
    elif df.iloc[row]['gruppe'] == '6':
        link1 = plattform + 'srsubjects/2024-00072/&user='
        link2 = voting + '-6&user='
    elif df.iloc[row]['gruppe'] == '7':
        link1 = plattform + 'qsubjects/2024-00073/&user='
        link2 = voting + '-7&user='
    elif df.iloc[row]['gruppe'] == '8':
        link1 = plattform + 'qsubjects/2024-00074/&user='
        link2 = voting + '-8&user='
    elif df.iloc[row]['gruppe'] == '9':
        link1 = plattform + 'qsubjects/2024-00075/&user='
        link2 = voting + '-9&user='
    elif df.iloc[row]['gruppe'] == '10':
        link1 = plattform + 'qrsubjects/2024-00081/&user='
        link2 = voting + '-10&user='
    elif df.iloc[row]['gruppe'] == '11':
        link1 = plattform + 'qrsubjects/2024-00080/&user='
        link2 = voting + '-11&user='
    elif df.iloc[row]['gruppe'] == '12':
        link1 = plattform + 'qrsubjects/2024-00079/&user='
        link2 = voting + '-12&user='
    elif df.iloc[row]['gruppe'] == '13':
        link1 = plattform + 'subjects/2024-00078/&user='
        link2 = voting + '-13&user='
    elif df.iloc[row]['gruppe'] == '14':
        link1 = plattform + 'subjects/2024-00077/&user='
        link2 = voting + '-14&user='
    elif df.iloc[row]['gruppe'] == '15':
        link1 = plattform + 'subjects/2024-00076/&user='
        link2 = voting + '-15&user='
    elif df.iloc[row]['gruppe'] == '16':
        link1 = plattform + 'ssubjects/2024-00097/&user='
        link2 = voting + '-16&user='
    elif df.iloc[row]['gruppe'] == '17':
        link1 = plattform + 'ssubjects/2024-00098/&user='
        link2 = voting + '-17&user='
    elif df.iloc[row]['gruppe'] == '18':
        link1 = plattform + 'ssubjects/2024-00099/&user='
        link2 = voting + '-18&user='
    elif df.iloc[row]['gruppe'] == '19':
        link1 = plattform + 'srsubjects/2024-00100/&user='
        link2 = voting + '-19&user='
    elif df.iloc[row]['gruppe'] == '20':
        link1 = plattform + 'srsubjects/2024-00101/&user='
        link2 = voting + '-20&user='
    elif df.iloc[row]['gruppe'] == '21':
        link1 = plattform + 'srsubjects/2024-00102/&user='
        link2 = voting + '-21&user='
    elif df.iloc[row]['gruppe'] == '22':
        link1 = plattform + 'qsubjects/2024-00103/&user='
        link2 = voting + '-22&user='
    elif df.iloc[row]['gruppe'] == '23':
        link1 = plattform + 'qsubjects/2024-00104/&user='
        link2 = voting + '-23&user='
    elif df.iloc[row]['gruppe'] == '24':
        link1 = plattform + 'qsubjects/2024-00105/&user='
        link2 = voting + '-24&user='
    elif df.iloc[row]['gruppe'] == '25':
        link1 = plattform + 'qrsubjects/2024-00106/&user='
        link2 = voting + '25-&user='
    elif df.iloc[row]['gruppe'] == '26':
        link1 = plattform + 'qrsubjects/2024-00107/&user='
        link2 = voting + '26-&user='
    elif df.iloc[row]['gruppe'] == '27':
        link1 = plattform + 'qrsubjects/2024-00108/&user='
        link2 = voting + '27-&user='
    elif df.iloc[row]['gruppe'] == '28':
        link1 = plattform + 'subjects/2024-00109/&user='
        link2 = voting + '28-&user='
    elif df.iloc[row]['gruppe'] == '29':
        link1 = plattform + 'subjects/2024-00110/&user='
        link2 = voting + '29-&user='
    elif df.iloc[row]['gruppe'] == '30':
        link1 = plattform + 'subjects/2024-00111/&user='
        link2 = voting + '30-&user='
    
    link1+=df.iloc[row]['email']+'&pass='+df.iloc[row]['password']
    link2+=df.iloc[row]['email']+'&pass='+df.iloc[row]['password']

    print(link1)
    print(link2) 
    df.loc[row,'link_platform'] = link1
    df.loc[row,'link_voting'] = link2


df.to_csv(file,sep=",",index=False)
