path = "C:\\Users\\shash\\Downloads\\Statement_XXXXXXXXXXX8968_21Jun2023_15_46.pdf"


def is_valid_pdf(file):
	signature = file.read(4)
	startxref_offset = find_startxref_offset(file)
	return signature == b'%PDF' and startxref_offset != -1


def find_startxref_offset(file):
	file.seek(-1024, 2)
	buffer = file.read()
	startxref_index = buffer.rfind(b'startxref')
	if startxref_index != -1:
		return startxref_index
	return -1


# Usage
pdf_path = "C:\\Users\\shash\\Downloads\\Shashank-Resume.pdf"
if is_valid_pdf(open(pdf_path, 'rb')):
	print("The PDF is valid.")
else:
	print("The PDF is not valid.")
