import { shallow, render, mount } from 'enzyme';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import renderer from 'react-test-renderer';

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;
global.ReactTestUtils = ReactTestUtils;
global.renderer = renderer;

console.error = message => {
    if (!/(React.createElement: type should not be null)/.test(message)) {
        throw new Error(message);
    }
};