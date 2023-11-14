import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
export default function Signup() {
	const [formData, setFormData] = useState({});

	const navigate = useNavigate();
	console.log(formData);
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};
	const handleSigninForm = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch('/api/user/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				return;
			}
			navigate('/signin');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<div className='p-3 max-w-lg mx-auto'>
				<h1 className='text-center text-3xl font-semibold my-7'>Sign Up</h1>
				<form onSubmit={handleSigninForm} className='flex flex-col gap-4'>
					<input
						onChange={handleChange}
						type='text'
						placeholder='firstname'
						id='firstname'
						className='p-3 border rounded-lg'
					/>
					<input
						onChange={handleChange}
						type='text'
						placeholder='lastname'
						id='lastname'
						className='p-3 border rounded-lg'
					/>
					<input
						onChange={handleChange}
						type='text'
						placeholder='mobile'
						id='mobile'
						className='p-3 border rounded-lg'
					/>
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
						Sign Up
					</button>
				</form>
				<div className='mt-5 flex gap-2'>
					<p>Have an account?</p>
					<Link to='/signin'>
						<span className='text-blue-700'>Sign in</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
