// Function to genrate the DCPSESSIONID
export function randomCode() {
	return Math.floor(100000 + Math.random() * 900000);
}
