def apr(p, r, n, t):
	return p*((1+(r/n))**(n*t))

if __name__ == '__main__':
	principle = 15000
	rate = .05
	comp = 12
	time = 4



	total = apr(principle, rate, comp, time)
	a = apr(10000, rate, comp, time)
	b = apr(5000, rate, comp, time)
	print("Total: {}".format(total))
	print("A: {}   B:{}   SUM: {}".format(a, b, total))



