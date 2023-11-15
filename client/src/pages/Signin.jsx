import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
export default function SignIn() {
	const [formData, setFormData] = useState({});

	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};
	const handleSignInForm = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch('/api/user/signin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				return;
			}
			navigate('/');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<div className='p-3 max-w-lg mx-auto'>
				<h1 className='text-center text-3xl font-semibold my-7'>Sign Up</h1>
				<form onSubmit={handleSignInForm} className='flex flex-col gap-4'>
					<input
						onChange={handleChange}
						type='email'
						placeholder='email'
						id='email'
						className='p-3 border rounded-lg'
					/>
					<input
						onChange={handleChange}
						type='password'
						placeholder='password'
						id='password'
						className='p-3 border rounded-lg'
					/>
					<button className='bg-slate-700 p-3 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80'>
						Sign In
					</button>
				</form>
				<div className='mt-5 flex gap-2'>
					<p>Dont have an account?</p>
					<Link to='/signup'>
						<span className='text-blue-700'>Sign Up</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
