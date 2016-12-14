import EventName from "../EventName.jsx";

describe("EventName", () => {
	it("renders correctly", () => {
		const en = renderer.create(
			<EventName name="Jay Kim"/>
			);
		expect(en).toMatchSnapshot();
	});
});