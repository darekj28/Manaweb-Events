import EditPostModal from '../EditPostModal.jsx';

describe('EditPostModal', () => {
	it('should call handlePostEditSubmit when submit is clicked', () => {
		window.$ = {ajax: jest.fn()}
		const refreshFeed = jest.fn();
		const post = {unique_id : 1};
		const wrapper = mount(
			<EditPostModal post={post} refreshFeed={refreshFeed}/>
			);
		const btn = wrapper.find('#epm_submit');
		btn.simulate('click');
		expect(refreshFeed).toHaveBeenCalled();
	});
	it('renders correctly', () => {
		const refreshFeed = jest.fn();
		const post = {unique_id : 1};
		const epm = renderer.create(
			<EditPostModal post={post} refreshFeed={refreshFeed}/>
			);
		expect(epm).toMatchSnapshot();
	});

})