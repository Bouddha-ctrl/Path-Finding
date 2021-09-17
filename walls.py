file1 = open('C:\\Users\\buddha\\Desktop\\walss.txt', 'r')
lines = file1.readlines()


s= "["
for line in lines:

    i = line.index(":")
    s+=line[i+2:-1]+','
s=s[:-1]
s+="]"
print(s)