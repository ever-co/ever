
export const isBrowser = () => typeof window !== 'undefined';

// @ts-ignore
// @ts-ignore
export const getUser = () =>
	isBrowser() && window.localStorage.getItem('user') ?
		JSON.parse(window.localStorage.getItem('user')) :
		{};

export const setUser = (user: {
	id?: string; token?: string;
}) => {
	window.localStorage.setItem('user', JSON.stringify(user))
	return user
};

// @ts-ignore
// export const handleLogin = ({ username, password }) => {
// 	return false;
// };

// @ts-ignore
export const handeUserCreate = (user = defaultUserData, password = '', createUserFunc) => {
	createUserFunc().then(
		({
			data
		}) => {
			(setUser({
				...data.registerUser
			}))
			return true
		}
	)

	return false;
};

export const isLoggedIn = () => {
	const user = getUser();

	return !!user.id;
};

export const logout = (callback: () => void) => {
	setUser({});
	callback();
};
