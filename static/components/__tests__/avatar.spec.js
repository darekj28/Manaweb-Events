import Avatar from '../Avatar.jsx';

describe('Avatar', () => {	
	it('renders correctly', () => {
		const src = "../../default.png";
		const avatar = renderer.create(
			<Avatar source={src}/>
			);
		expect(avatar).toMatchSnapshot();
	});
})