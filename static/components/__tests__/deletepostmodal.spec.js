import DeletePostModal from '../DeletePostModal.jsx';

describe('DeletePostModal', () => {
	it('should call handlePostDelete when yes is clicked', () => {
		window.$ = {ajax: jest.fn()}
		const refreshFeed = jest.fn();
		const post = {unique_id : 1};
		const wrapper = mount(
			<DeletePostModal post={post} refreshFeed={refreshFeed}/>
			);
		const btn = wrapper.find('#dpm_yes');
		btn.simulate('click');
		expect(refreshFeed).toHaveBeenCalled();
	});
	it('renders correctly', () => {
		const refreshFeed = jest.fn();
		const post = {unique_id : 1};
		const dpm = renderer.create(
			<DeletePostModal post={post} refreshFeed={refreshFeed}/>
			);
		expect(dpm).toMatchSnapshot();
	});
})