import EditCommentModal from '../EditCommentModal.jsx';

describe('EditCommentModal', () => {
	it('should call handleCommentEditSubmit when submit is clicked', () => {
		window.$ = {ajax: jest.fn()}
		const refreshFeed = jest.fn();
		const comment = {unique_id : 1};
		const wrapper = mount(
			<EditCommentModal comment={comment} refreshFeed={refreshFeed}/>
			);
		const btn = wrapper.find('#ecm_submit');
		btn.simulate('click');
		expect(refreshFeed).toHaveBeenCalled();
	});
	it('renders correctly', () => {
		const refreshFeed = jest.fn();
		const comment = {unique_id : 1};
		const ecm = renderer.create(
			<EditCommentModal comment={comment} refreshFeed={refreshFeed}/>
			);
		expect(ecm).toMatchSnapshot();
	});

})