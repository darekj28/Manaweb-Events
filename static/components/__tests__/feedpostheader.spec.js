import FeedPostHeader from '../FeedPostHeader.jsx';

describe('FeedPostHeader', () => {
	it('renders correctly', () => {
		const fph = renderer.create(
			<FeedPostHeader name="a" userID="a" handleFilterUser={jest.fn()} 
				isTrade={true} isPlay={true} isChill={true} time="a"/>
			);
		expect(fph).toMatchSnapshot();
	});
});