export default {
	info: (msg: unknown, msg2?: unknown) => console.info(msg, msg2 ? msg2 : ""),
	error: (msg: unknown, msg2?: unknown) => console.error(msg, msg2 ? msg2 : ""),
	query: (msg: string) => logQuery(msg)
};

const logQuery = (msg: string) => {
	console.info(msg.replace(/%/g, "\\%"));
};
