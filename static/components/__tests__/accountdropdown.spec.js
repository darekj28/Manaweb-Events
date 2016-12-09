import AccountDropdown from '../AccountDropdown.jsx';

describe("AccountDropdown", () => {
	it("renders correctly", () => {
		const name = "Jay Kim";
		const ad = renderer.create(
			<AccountDropdown name={name}/>
			);
		expect(ad).toMatchSnapshot();
	});
});