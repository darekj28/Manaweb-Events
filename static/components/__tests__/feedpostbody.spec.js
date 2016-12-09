import FeedPostBody from '../FeedPostBody.jsx';

describe('FeedPostBody', () => {
	it('renders correctly', () => {
		const fpb = renderer.create(
			<FeedPostBody content="a"/>
			);
		expect(fpb).toMatchSnapshot();
	});
});