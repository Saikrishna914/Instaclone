import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Profile = () => {
	return (
		<div>
			<Avatar>
				<AvatarImage />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
		</div>
	)
}

export default Profile