import Yoga from 'yoga-layout';
import toPairsIn from 'lodash/fp/toPairsIn';
import isFunction from 'lodash/fp/isFunction';
import upperFirst from 'lodash/fp/upperFirst';

class Base {
  root = false; // No root layout node
  children = [];

  constructor() {
    this.layout = Yoga.Node.create();
  }

  appendChild(child) {
    this.children.push(child);
    this.layout.insertChild(child.layout, 0);
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    this.children.slice(index, 1);
    this.layout.removeChild(child.layout, 0);
  }

  inject(parent) {
    this.parent = parent;
    parent.appendChild(this);
  }

  eject(parent) {
    this.parent = null;
    parent.removeChild(this);
  }

  /* Apply styles for yoga */
  applyStyles(styles) {
    const isLayoutFunction = prop =>
      isFunction(this.layout[`set${upperFirst(prop)}`]);

    toPairsIn(styles).map(([prop, value]) => {
      if (isLayoutFunction(prop)) {
        this.layout[`set${upperFirst(prop)}`](value);
      }
    });
  }

  applyProps(props) {
    if (props.style) {
      this.applyStyles(props.style);
    }
  }
}

export default Base;
