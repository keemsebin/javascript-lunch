var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _id, _storeName, _distance, _category, _description, _link, _isFavorite;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
class Component {
  constructor(props) {
    __publicField(this, "props");
    __publicField(this, "state");
    __publicField(this, "children");
    this.props = props;
    this.children = [];
    this.setDefaultProps();
    this.initState();
    this.setEvent();
  }
  initState() {
    this.state = {};
  }
  addChild(ComponentClass, props = {}) {
    const component = new ComponentClass();
    component.setProps(props);
    this.children.push(component);
    return component;
  }
  template() {
    return "";
  }
  setEvent() {
  }
  setDefaultProps() {
    this.props = {};
  }
  setProps(newProps) {
    this.props = {
      ...this.props,
      ...newProps
    };
  }
  setState(newState) {
    this.state = {
      ...this.state,
      ...newState
    };
    this.render();
  }
  render(props, targetElement = "#app") {
    if (props) this.setProps(props);
    const container = document.querySelector(targetElement);
    container.innerHTML = this.template(this.props);
    return container;
  }
}
class LocalStorage {
  static getItems(storageKey) {
    const storedData = localStorage.getItem(storageKey);
    return storedData ? JSON.parse(storedData) : [];
  }
  static saveItems(items, storageKey) {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }
}
const urlRegex = /https?:\/\/[^\s"]/;
class Restaurant {
  constructor({
    id,
    storeName,
    distance,
    category,
    description = "",
    link = "",
    isFavorite = false
  }) {
    __privateAdd(this, _id);
    __privateAdd(this, _storeName);
    __privateAdd(this, _distance);
    __privateAdd(this, _category);
    __privateAdd(this, _description);
    __privateAdd(this, _link);
    __privateAdd(this, _isFavorite, false);
    __privateSet(this, _id, id);
    __privateSet(this, _storeName, storeName);
    __privateSet(this, _distance, distance);
    __privateSet(this, _category, category);
    __privateSet(this, _description, description);
    __privateSet(this, _link, link);
    __privateSet(this, _isFavorite, isFavorite);
    this.validate();
  }
  validate() {
    if (__privateGet(this, _storeName) === "") {
      throw new Error("음식점 이름 입력해주세요.");
    }
    if (!__privateGet(this, _distance)) {
      throw new Error("거리를 선택해주세요.");
    }
    if (!__privateGet(this, _category)) {
      throw new Error("카테고리를 선택해주세요.");
    }
    if (__privateGet(this, _link) && !urlRegex.test(__privateGet(this, _link))) {
      throw new Error("링크 형식이 올바르지 않습니다.");
    }
  }
  get restaurantValue() {
    return {
      id: __privateGet(this, _id),
      storeName: __privateGet(this, _storeName),
      distance: __privateGet(this, _distance),
      category: __privateGet(this, _category),
      description: __privateGet(this, _description),
      link: __privateGet(this, _link),
      isFavorite: __privateGet(this, _isFavorite)
    };
  }
}
_id = new WeakMap();
_storeName = new WeakMap();
_distance = new WeakMap();
_category = new WeakMap();
_description = new WeakMap();
_link = new WeakMap();
_isFavorite = new WeakMap();
const STORAGE_KEY = "restaurantItem";
const RestaurantFacade = {
  getAll() {
    return LocalStorage.getItems(STORAGE_KEY);
  },
  create(data) {
    const id = this.getLastId() + 1;
    const restaurant = new Restaurant({ ...data, id });
    const restaurants = this.getAll();
    restaurants.push(restaurant.restaurantValue);
    LocalStorage.saveItems(restaurants, STORAGE_KEY);
    return restaurant;
  },
  importData(items) {
    const restaurants = this.getAll();
    let lastId = this.getLastId();
    const newRestaurants = items.map((item) => {
      lastId++;
      return { ...item, id: lastId };
    });
    LocalStorage.saveItems([...restaurants, ...newRestaurants], STORAGE_KEY);
  },
  toggleFavorite(id) {
    const restaurants = this.getAll();
    const restaurant = restaurants.find((r) => r.id === id);
    if (restaurant) {
      restaurant.isFavorite = !restaurant.isFavorite;
      LocalStorage.saveItems(restaurants, STORAGE_KEY);
    }
  },
  getById(id) {
    return this.getAll().find((r) => r.id === id) || null;
  },
  removeById(id) {
    const restaurants = this.getAll().filter(
      (r) => Number(r.id) !== Number(id)
    );
    LocalStorage.saveItems(restaurants, STORAGE_KEY);
  },
  getLastId() {
    const restaurants = this.getAll();
    return restaurants.length > 0 ? Math.max(...restaurants.map((r) => r.id)) : 0;
  }
};
const styleStr = (styles) => Object.entries(styles).map(([key, value]) => `${key}: ${value};`).join(" ");
const primary = ["bg-primary-500", "white", "border-none"];
const secondary = ["bg-white", "slate-400", "border", "border-slate-400"];
class Button extends Component {
  setDefaultProps() {
    this.props = {
      text: "",
      variant: "primary",
      disabled: false,
      onClick: () => {
      },
      styles: {},
      id: ""
    };
  }
  setEvent() {
    if (!this.props) return;
    document.removeEventListener("click", this.handleButtonClick);
    this.handleButtonClick = (e) => {
      if (e.target.closest(`#${this.props.id}`)) {
        this.props.onClick();
      }
    };
    document.addEventListener("click", this.handleButtonClick);
  }
  template() {
    const { text, variant, disabled, styles, id } = this.props;
    return `
      <button 
        id="${id}"  
        type="submit"
        ${disabled && "disabled"} 
        class="${variant === "primary" ? primary.join(" ") : secondary.join(" ")} w-full h-44 flex justify-center items-center text-lg rounded-lg cursor-pointer"
        style="${styleStr(styles)}"
      >
        ${text}
      </button>
    `;
  }
}
class Icon extends Component {
  setDefaultProps() {
    this.props = {
      size: "40",
      iconName: "",
      classList: [],
      styles: {},
      id: "init"
    };
  }
  template() {
    const { size, iconName, classList, styles, id } = this.props;
    return `
      <img
        id="${id}"
        width="${size}"
        height="${size}"
        alt="${iconName}"
        src="./public/${iconName}.png"
        class=" ${classList.join(" ")} cursor-pointer" 
        style="${styleStr(styles)}"
      />
      `;
  }
}
class CircleIcon extends Component {
  setDefaultProps() {
    this.props = {
      iconName: "",
      size: "64",
      classList: [],
      styles: {},
      id: "init"
    };
  }
  renderIcon() {
    const icon = this.addChild(Icon, {
      iconName: this.props.iconName
    });
    return icon.template();
  }
  template() {
    const { iconName, classList, styles, id } = this.props;
    return `
      <span id="${id}" class="w-64 h-64 flex justify-center items-center rounded-full bg-primary-300">
        ${this.renderIcon()}
      </span>
      `;
  }
}
class Text extends Component {
  setDefaultProps() {
    this.props = {
      content: "",
      required: false,
      classList: [],
      styles: {},
      id: "init"
    };
  }
  template() {
    const { content, required, classList, styles, id } = this.props;
    return `
      <p
        id="${id}"
        class="${classList.join(" ")}" 
        style="${styleStr(styles)}"
      >
        ${content} ${required ? `<span style="color: red;">*</span>` : ""}
      </p>`;
  }
}
class Header extends Component {
  setDefaultProps() {
    this.props = {
      title: "",
      iconName: "",
      onIconClick: () => {
      }
    };
  }
  renderText() {
    const text = this.addChild(Text, {
      content: this.props.title,
      classList: ["text-2xl cursor-pointer"],
      id: "header-text"
    });
    return text.template();
  }
  renderIcon() {
    const icon = this.addChild(Icon, {
      iconName: this.props.iconName,
      id: "header-icon"
    });
    return icon.template();
  }
  setEvent() {
    document.removeEventListener("click", this.handleClick);
    this.handleClick = (event) => {
      if (event.target.closest("#header-icon")) {
        this.props.onIconClick();
      }
      if (event.target.closest("#header-text")) {
        location.reload();
      }
    };
    document.addEventListener("click", this.handleClick);
  }
  template() {
    return `
    <header class="w-full h-64 flex justify-between items-center bg-primary-500 white px-16 box-border">
      ${this.renderText()}
      ${this.renderIcon()}
    </header>
    `;
  }
}
class Layout extends Component {
  template() {
    return `
    <main id="layout" class="max-w-390 w-full h-full flex flex-col justify-start items-center mx-16 bg-white">
      ${this.children.map((child) => child.template()).join("")}
    </main>`;
  }
}
class Select extends Component {
  setDefaultProps() {
    this.props = {
      placeholder: "선택해주세요",
      options: [],
      onChange: () => {
      },
      dropDownClassList: [],
      selectClassList: [],
      id: "init"
    };
  }
  initState() {
    this.state = { isOpen: false, selected: "" };
  }
  selectOption(option) {
    this.setState({ selected: option, isOpen: false });
    this.props.onChange(option);
    this.render();
  }
  handleToggleButtonClick(e) {
    const button = e.target.closest(`#${this.props.id}-button`);
    if (button) {
      this.setState({ isOpen: !this.state.isOpen });
      return true;
    }
    return false;
  }
  handleDropdownOptionClick(e) {
    const option = e.target.closest(`#${this.props.id}-dropdown li`);
    if (option) {
      this.selectOption(option.dataset.value);
      return true;
    }
    return false;
  }
  handleOutsideClick(e) {
    const dropdown = document.querySelector(`#${this.props.id}-dropdown`);
    if (dropdown && !dropdown.contains(e.target)) {
      this.setState({ isOpen: false });
      return true;
    }
    return false;
  }
  setEvent() {
    document.removeEventListener("click", this.handleClickSelect);
    this.handleClickSelect = (e) => {
      if (this.handleToggleButtonClick(e)) return;
      if (this.handleDropdownOptionClick(e)) return;
      this.handleOutsideClick(e);
    };
    document.addEventListener("click", this.handleClickSelect);
  }
  createOptionItems() {
    return this.props.options.map(
      (option) => `<li data-value="${option}" class="cursor-pointer py-16 px-8">${option}</li>`
    ).join("");
  }
  renderDropDownItem() {
    const { options, dropDownClassList, id } = this.props;
    if (!this.state.isOpen) return "";
    return `
      <ul 
        id="${id}-dropdown"
        class=" dropdown-shadow ${dropDownClassList.join(
      " "
    )} min-h-44 absolute w-full bg-white border rounded-lg mt-8 left-0 overflow-y"
        style="top: 100%; z-index: 100; list-style: none; max-height: 200px;"
        >
        ${this.createOptionItems()}
      </ul>
    `;
  }
  createButtonContent() {
    const { selected } = this.state;
    const { placeholder } = this.props;
    return `${selected ? selected : placeholder}
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" style="transition: transform 0.2s;">
        <path d="M5 8L10 13L15 8" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
      </svg>`;
  }
  template() {
    const { id, selectClassList } = this.props;
    return `
      <div id="${this.props.id}" class="relative">
        <button type="button" id="${id}-button" class="${selectClassList.join(
      " "
    )} w-full h-44 flex items-center justify-between cursor-pointer border rounded-lg bg-white text-lg">
           ${this.createButtonContent()}
        </button>
        ${this.renderDropDownItem()} 
      </div>
    `;
  }
  updateButtonText(button) {
    const { selected } = this.state;
    const { placeholder } = this.props;
    const buttonTextNode = Array.from(button.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE
    );
    if (buttonTextNode) {
      buttonTextNode.textContent = selected ? selected : placeholder;
    }
  }
  updateSvgRotation(button) {
    const svg = button.querySelector("svg");
    if (svg) {
      svg.style.transform = this.state.isOpen ? "rotate(180deg)" : "";
    }
  }
  updateDropdown(container) {
    const dropdownContainer = container.querySelector("ul");
    if (this.state.isOpen && dropdownContainer) {
      dropdownContainer.outerHTML = this.renderDropDownItem();
    }
    if (this.state.isOpen && !dropdownContainer) {
      container.insertAdjacentHTML("beforeend", this.renderDropDownItem());
    }
    if (!this.state.isOpen && dropdownContainer) {
      dropdownContainer.remove();
    }
  }
  render(props, targetElement = `#${this.props.id}`) {
    if (props) this.setProps(props);
    const container = document.querySelector(targetElement);
    const button = container.querySelector(`#${this.props.id}-button`);
    if (container.id === this.props.id && button) {
      this.updateButtonText(button);
      this.updateSvgRotation(button);
    }
    this.updateDropdown(container);
  }
}
const categories = [
  "한식",
  "중식",
  "일식",
  "아시안",
  "양식",
  "기타"
];
const distances = [5, 10, 15, 20, 25, 30];
const CATEGORY_IMAGE = {
  한식: "category-korean",
  중식: "category-chinese",
  일식: "category-japanese",
  아시안: "category-asian",
  양식: "category-western",
  기타: "category-etc"
};
class LunchItem extends Component {
  setDefaultProps() {
    this.props = {
      id: 0,
      storeName: "",
      distance: "",
      category: "",
      description: "",
      isFavorite: false,
      onClick: () => {
      }
    };
  }
  renderStoreName() {
    const storeName = this.addChild(Text);
    storeName.setProps({
      content: this.props.storeName,
      classList: ["text-xl"],
      id: "store-name-item"
    });
    return storeName.template();
  }
  renderDistance() {
    const distance = this.addChild(Text);
    distance.setProps({
      content: `캠퍼스 내 ${this.props.distance}분`,
      classList: ["text-lg", "primary-500"],
      id: "distance-item"
    });
    return distance.template();
  }
  renderDescription() {
    if (!this.props.description) return "";
    const description = this.addChild(Text);
    description.setProps({
      content: this.props.description,
      classList: ["text-lg", "my-8"],
      styles: {
        display: "-webkit-box",
        "-webkit-line-clamp": 2,
        "-webkit-box-orient": "vertical"
      },
      id: "description-item"
    });
    return description.template();
  }
  renderCircleIcon() {
    const icon = this.addChild(CircleIcon);
    icon.setProps({
      iconName: CATEGORY_IMAGE[this.props.category],
      id: "category-item"
    });
    return icon.template();
  }
  renderFavoriteIcon() {
    const favoriteIcon = this.addChild(Icon);
    favoriteIcon.setProps({
      size: "32",
      iconName: this.props.isFavorite ? "favorite-icon-filled" : "favorite-icon-lined",
      id: "favorite-icon-item"
    });
    return favoriteIcon.template();
  }
  dispatchFavoriteToggleEvent() {
    RestaurantFacade.toggleFavorite(this.props.id);
    document.dispatchEvent(new CustomEvent("itemChange"));
  }
  handleFavoriteButtonClick(e) {
    const favoriteButton = e.target.closest("#favorite-button");
    if (favoriteButton && Number(favoriteButton.dataset.id) === this.props.id) {
      e.stopPropagation();
      this.dispatchFavoriteToggleEvent();
      favoriteButton.innerHTML = this.renderFavoriteIcon();
      return true;
    }
    return false;
  }
  handleLunchItemClick(e) {
    const lunchItem = e.target.closest(`#lunch-item-${this.props.id}`);
    if (lunchItem) {
      this.props.onClick();
      return true;
    }
    return false;
  }
  setEvent() {
    document.removeEventListener("click", this.handleClickLunchItem);
    this.handleClickLunchItem = (e) => {
      if (this.handleFavoriteButtonClick(e)) return;
      if (this.handleLunchItemClick(e)) return;
    };
    document.addEventListener("click", this.handleClickLunchItem);
  }
  createHeaderSection() {
    return `
      <div class="flex flex-row justify-between items-start w-full">
        <div class="flex flex-col items-start">
          ${this.renderStoreName()}
          ${this.renderDistance()}
        </div>
        <div class="flex flex-row items-center">
          <button id="favorite-button" data-id="${this.props.id}" style="background: none; border: none;">
            ${this.renderFavoriteIcon()}
          </button>
        </div>
      </div>
    `;
  }
  template() {
    return `
      <div id="lunch-item-${this.props.id}" data-id="${this.props.id}" 
           class="flex flex-row items-start gap-16 py-16 px-8 border-b-slate" 
           style="height: auto;">
        <div>
          ${this.renderCircleIcon()}
        </div>
        <div class="flex flex-col overflow-hidden" style="width: 280px;">
          ${this.createHeaderSection()}
          ${this.renderDescription()}
        </div>
      </div>
    `;
  }
  render(props, targetElement = `#lunch-item-${this.props.id}`) {
    if (props) this.setProps(props);
    super.render(props, targetElement);
  }
}
const LUNCH_LIST_TYPE = {
  ALL: "ALL",
  FAVORITES: "FAVORITES"
};
class LunchList extends Component {
  setDefaultProps() {
    this.props = {
      type: LUNCH_LIST_TYPE.ALL,
      items: [],
      onItemClick: () => {
      }
    };
  }
  initState() {
    this.state = {
      items: this.filterItemsByType(this.props.items, this.props.type)
    };
  }
  filterItemsByType(items, type) {
    if (!items) return [];
    return type === LUNCH_LIST_TYPE.ALL ? items : items.filter((item) => item.isFavorite);
  }
  setProps(newProps) {
    super.setProps(newProps);
    if (newProps.items) {
      this.setState({
        items: this.filterItemsByType(
          newProps.items,
          newProps.type || this.props.type
        )
      });
    }
  }
  renderLunchItem(item) {
    const lunchItem = this.addChild(LunchItem, {
      ...item,
      onClick: () => this.props.onItemClick(item)
    });
    return lunchItem;
  }
  renderItems() {
    return this.state.items.map((item) => this.renderLunchItem(item).template()).join("");
  }
  renderText() {
    const text = this.addChild(Text, {
      content: this.props.type === LUNCH_LIST_TYPE.FAVORITES ? "즐겨찾기한 음식점이 없습니다." : "아직 추가된 음식점이 없습니다.",
      classList: ["text-lg", "text-slate-500"]
    });
    return text.template();
  }
  renderCircleIcon() {
    const icon = this.addChild(CircleIcon, {
      iconName: "category-korean"
    });
    return icon.template();
  }
  template() {
    const { items } = this.state;
    const isEmpty = !items || items.length === 0;
    return `
      <section id="lunch-list-container" class="w-full flex flex-col justify-center items-center my-4">
        <ul id="restaurant-list" class="w-full max-h-620 overflow-y" style="flex-grow: 1; ">
          ${isEmpty ? `<div class="flex flex-col items-center justify-center gap-16 mt-32 py-8">
                ${this.renderCircleIcon()}
                ${this.renderText()}
              </div>` : this.renderItems()}
        </ul>
      </section>
    `;
  }
  render(props, targetElement = "#lunch-list-container") {
    if (props) this.setProps(props);
  }
}
class AllLunchList extends Component {
  setDefaultProps() {
    this.props = {
      items: [],
      onItemClick: () => {
      }
    };
  }
  initState() {
    this.state = {
      category: "전체",
      sortBy: "이름순"
    };
  }
  filterByCategory(items) {
    if (this.state.category === "전체") return items;
    return items.filter((item) => item.category === this.state.category);
  }
  sortByName(items) {
    return items.sort((a, b) => a.storeName.localeCompare(b.storeName));
  }
  sortByDistance(items) {
    return items.sort((a, b) => {
      return a.distance - b.distance;
    });
  }
  filterItems() {
    const filteredByCategory = this.filterByCategory(this.props.items);
    if (this.state.sortBy === "이름순") {
      return this.sortByName(filteredByCategory);
    }
    if (this.state.sortBy === "거리순") {
      return this.sortByDistance(filteredByCategory);
    }
    return filteredByCategory;
  }
  renderCategoryFilter() {
    const categoryFilterSelect = this.addChild(Select, {
      placeholder: "전체",
      options: ["전체", ...categories],
      onChange: (value) => this.setState({ category: value }),
      selectClassList: ["w-125"],
      dropDownClassList: ["w-125"],
      id: "category-filter-select"
    });
    return categoryFilterSelect.template();
  }
  renderNameDistanceFilter() {
    const nameDistanceFilterSelect = this.addChild(Select, {
      placeholder: "이름순",
      options: ["이름순", "거리순"],
      onChange: (value) => this.setState({ sortBy: value }),
      selectClassList: ["w-125"],
      dropDownClassList: ["w-125"],
      id: "name-distance-filter-select"
    });
    return nameDistanceFilterSelect.template();
  }
  renderLunchList() {
    const allLunchList = this.addChild(LunchList, {
      type: "ALL",
      items: this.filterItems(),
      onItemClick: this.props.onItemClick
    });
    return allLunchList.template();
  }
  template() {
    return `
      <div id="all-lunch-list" class="w-full px-16 box-border">
        <div id="filter" class="w-full flex flex-row justify-between my-16">
          ${this.renderCategoryFilter()}
          ${this.renderNameDistanceFilter()}
        </div>
        ${this.renderLunchList()}
      </div>
    `;
  }
  updateFilterAndList(container) {
    const filterContainer = container.querySelector("#filter");
    const existingList = container.querySelector("#lunch-list-container");
    const listContent = this.renderLunchList();
    if (!filterContainer)
      return filterContainer.insertAdjacentHTML("afterend", listContent);
    filterContainer.innerHTML = `
        ${this.renderCategoryFilter()}
        ${this.renderNameDistanceFilter()}
      `;
    if (existingList) return existingList.outerHTML = listContent;
  }
  render(props, targetElement = "#all-lunch-list") {
    if (props) this.setProps(props);
    const container = document.querySelector(targetElement);
    if (container.id === "all-lunch-list") {
      this.updateFilterAndList(container);
    }
  }
}
class TextArea extends Component {
  setDefaultProps() {
    this.props = {
      rows: 1,
      maxLength: 10,
      placeHolder: "",
      onInput: () => {
      },
      classList: [],
      styles: {},
      id: "init",
      isRequired: false
    };
  }
  setEvent() {
    if (!this.props) return;
    document.removeEventListener("input", this.handleTextAreaInput);
    this.handleTextAreaInput = (e) => {
      if (e.target.id === this.props.id) {
        this.props.onInput(e.target.value);
      }
    };
    document.addEventListener("input", this.handleTextAreaInput);
  }
  template() {
    const { isRequired, rows, maxLength, placeHolder, classList, styles, id } = this.props;
    return `
      <textarea 
        ${isRequired && "required"}
        autofocus
        id="${id}"
        name="${id}"
        rows="${rows}"
        maxlength="${maxLength}"
        placeholder="${placeHolder}"
        class="${classList.join(
      " "
    )} w-full border px-8 py-8 box-border text-lg"
        style="${styleStr(styles)}"
      ></textarea>
    `;
  }
}
class LunchForm extends Component {
  initState() {
    this.state = {
      category: "",
      storeName: "",
      distance: "",
      description: "",
      link: ""
    };
  }
  renderLunchText() {
    const lunchText = this.addChild(Text, {
      content: "새로운 음식점",
      classList: ["w-full", "text-2xl"],
      id: "lunch-form-title"
    });
    return lunchText.template();
  }
  renderCategory() {
    const categoryLabel = this.addChild(Text, {
      content: "카테고리",
      required: true,
      classList: ["text-lg", "slate-500"],
      id: "category-label"
    });
    const categorySelect = this.addChild(Select, {
      options: categories,
      onChange: (value) => this.setState({ category: value }),
      id: "category-select"
    });
    return `
    <div class="w-full h-64 flex flex-col">
      ${categoryLabel.template()}
      ${categorySelect.template()}
    </div>
    `;
  }
  renderStoreName() {
    const storeNameLabel = this.addChild(Text, {
      content: "이름",
      required: true,
      classList: ["text-lg", "slate-500"],
      id: "store-name-label"
    });
    const storeName = this.addChild(TextArea, {
      rows: 1,
      maxLength: 14,
      placeHolder: "피양콩할마니",
      onInput: (value) => this.setState({ storeName: value }),
      classList: ["h-44", "rounded-lg", "resize-none"],
      id: "store-name-textarea",
      isRequired: true
    });
    return `
      <div class="w-full flex flex-col">
        ${storeNameLabel.template()}
        ${storeName.template()}
      </div>
    `;
  }
  renderDistance() {
    const distanceLabel = this.addChild(Text, {
      content: "거리(도보 이동 시간)",
      required: true,
      classList: ["text-lg", "slate-500"],
      id: "distance-label"
    });
    const distance = this.addChild(Select, {
      options: distances.map((distance2) => `${distance2}분`),
      onChange: (value) => this.setState({ distance: value }),
      id: "distance-select"
    });
    return `
        <div class="w-full h-64 flex flex-col">
          ${distanceLabel.template()}
          ${distance.template()}
        </div>
    `;
  }
  renderDescription() {
    const descriptionLabel = this.addChild(Text, {
      content: "설명",
      required: false,
      classList: ["text-lg", "slate-500"],
      id: "description-label"
    });
    const description = this.addChild(TextArea, {
      rows: 3,
      maxLength: 255,
      isRequired: false,
      placeHolder: "설명을 입력해주세요. 설명은 최대 255글자까지 가능합니다.",
      onInput: (value) => this.setState({ description: value }),
      classList: ["h-90", "rounded-lg", "resize-none"],
      id: "description-textarea"
    });
    return `
      <div class="w-full flex flex-col">
        ${descriptionLabel.template()}
        ${description.template()}
      </div>
    `;
  }
  renderLink() {
    const linkLabel = this.addChild(Text, {
      content: "참고 링크",
      classList: ["text-lg", "slate-500"],
      id: "link-label"
    });
    const link = this.addChild(TextArea, {
      rows: 1,
      maxLength: 100,
      isRequired: false,
      placeHolder: "https://techcourse.woowahan.com/",
      onInput: (value) => this.setState({ link: value }),
      classList: ["h-44", "rounded-lg", "resize-none"],
      id: "link-textarea"
    });
    return `
      <div class="w-full flex flex-col">
        ${linkLabel.template()}
        ${link.template()}
      </div>
    `;
  }
  renderButton() {
    const cancelBtn = this.addChild(Button, {
      text: "취소하기",
      variant: "secondary",
      classList: ["w-full"],
      onClick: () => this.handleReset(),
      id: "cancel-btn"
    });
    const submitBtn = this.addChild(Button, {
      text: "추가하기",
      variant: "primary",
      classList: ["w-full"],
      onClick: (e) => this.handleSubmit.bind(this),
      id: "submit-btn"
    });
    return `
        <div class="w-full flex gap-16 flex-row justify-between items-center">
          ${cancelBtn.template()}
          ${submitBtn.template()}
        </div>
      `;
  }
  handleSubmit(e) {
    e.preventDefault();
    RestaurantFacade.create({
      storeName: this.state.storeName,
      distance: this.state.distance.replace("분", ""),
      category: this.state.category,
      description: this.state.description,
      link: this.state.link,
      isFavorite: false
    });
    this.handleReset();
  }
  handleReset() {
    this.setState({
      category: "",
      storeName: "",
      distance: "",
      description: "",
      link: ""
    });
  }
  template() {
    return `
    <form id="lunch-form" class="flex flex-col justify-start items-start gap-32 mt-32 mb-32" >
      ${this.renderLunchText()}
      ${this.renderCategory()}
      ${this.renderStoreName()}
      ${this.renderDistance()}
      ${this.renderDescription()}    
      ${this.renderLink()}
      ${this.renderButton()}
    </form>
    `;
  }
  render(props) {
  }
}
class Tab extends Component {
  setDefaultProps() {
    this.props = {
      tabs: [],
      activeIndex: 0,
      styles: {},
      onItemClick: () => {
      }
    };
  }
  initState() {
    this.state = {
      activeIndex: this.props.activeIndex || 0,
      items: RestaurantFacade.getAll() || []
    };
  }
  updateItems() {
    this.setState({ items: RestaurantFacade.getAll() || [] });
    this.render();
  }
  renderAllList() {
    const list = this.addChild(AllLunchList, {
      type: "ALL",
      items: this.state.items,
      onItemClick: this.props.onItemClick
    });
    return list.template();
  }
  renderFavoritesList() {
    const favoritesList = this.addChild(LunchList, {
      type: "FAVORITES",
      items: this.state.items.filter((item) => item.isFavorite),
      onItemClick: this.props.onItemClick
    });
    return favoritesList.template();
  }
  getTabButtonClass(index) {
    const { activeIndex } = this.state;
    return activeIndex === index ? "primary-500 border-b-primary" : "slate-400 border-b-slate";
  }
  renderTabs() {
    return this.props.tabs.map((tab, index) => this.renderTabButton(tab, index)).join("");
  }
  renderTabButton(tab, index) {
    const { activeIndex } = this.state;
    return `
      <button
        id="tab-button"
        type="button"
        data-index="${index}"
        class="w-full text-lg py-16 cursor-pointer ${this.getTabButtonClass(
      index
    )}"
        style="background: none; border-top: none; border-left: none; border-right: none;"
      >
        ${tab}
      </button>
    `;
  }
  handleTabClickEvent() {
    document.removeEventListener("click", this.handleClickTab);
    this.handleClickTab = (e) => {
      const tabButton = e.target.closest("#tab-button");
      if (tabButton && tabButton.closest(`#tab-container`)) {
        this.setState({ activeIndex: parseInt(tabButton.dataset.index) });
      }
    };
    document.addEventListener("click", this.handleClickTab);
  }
  handleItemChangeEvent() {
    document.addEventListener("itemChange", () => this.updateItems());
  }
  setEvent() {
    this.handleTabClickEvent();
    this.handleItemChangeEvent();
  }
  template() {
    return `
      <div id="tab-container" class="w-full mt-8">
        <div class="flex flex-row justify-between px-16">
          ${this.renderTabs()}
        </div>
        <div id="tab-content-container">
          ${this.renderAllList()}
        </div>
      </div>
    `;
  }
  updateTabButtons(container) {
    const tabButtons = container.querySelectorAll("#tab-button");
    tabButtons.forEach((button, index) => {
      this.updateButtonClass(button, index);
    });
  }
  updateButtonClass(button, index) {
    const { activeIndex } = this.state;
    button.classList.remove("primary-500", "border-b-primary");
    button.classList.add("slate-400", "border-b-slate-solid");
    if (index === activeIndex) {
      button.classList.remove("slate-400", "border-b-slate-solid");
      button.classList.add("primary-500", "border-b-primary");
    }
  }
  updateTabContent(container) {
    const tabContentContainer = container.querySelector(
      "#tab-content-container"
    );
    if (tabContentContainer) {
      tabContentContainer.innerHTML = this.state.activeIndex === 0 ? this.renderAllList() : this.renderFavoritesList();
    }
  }
  render(props, targetElement = `#tab-container`) {
    if (props) this.setProps(props);
    const container = document.querySelector(targetElement);
    if (!container) return super.render(props, targetElement);
    this.updateTabButtons(container);
    this.updateTabContent(container);
    return this;
  }
}
class LunchItemDetail extends Component {
  setDefaultProps() {
    this.props = {
      id: 0,
      storeName: "",
      distance: "",
      category: "",
      description: "",
      link: "",
      isFavorite: false
    };
  }
  renderCircleIcon() {
    const icon = this.addChild(CircleIcon, {
      iconName: CATEGORY_IMAGE[this.props.category],
      id: "category-detail-item"
    });
    return icon.template();
  }
  renderFavoriteIcon() {
    const favoriteIcon = this.addChild(Icon, {
      size: "32",
      iconName: this.props.isFavorite ? "favorite-icon-filled" : "favorite-icon-lined",
      id: "favorite-detail-item"
    });
    return favoriteIcon.template();
  }
  renderStoreName() {
    const storeName = this.addChild(Text, {
      content: this.props.storeName,
      classList: ["text-xl"],
      id: "store-name-detail-item"
    });
    return storeName.template();
  }
  renderDistance() {
    const distance = this.addChild(Text, {
      content: `캠퍼스 내 ${this.props.distance}분`,
      classList: ["text-lg", "primary-500"],
      id: "distance-detail-item"
    });
    return distance.template();
  }
  renderDescription() {
    if (!this.props.description) return "";
    const description = this.addChild(Text, {
      content: this.props.description,
      classList: ["text-lg", "my-8"],
      id: "description-detail-item"
    });
    return description.template();
  }
  renderLink() {
    if (!this.props.link) return "";
    const link = this.addChild(Text, {
      content: this.props.link,
      classList: ["text-lg", "slate-500"],
      id: "link-detail-item"
    });
    return `
    <a href="${this.props.link}" target="_blank" style="text-decoration: underline; color: black;">${link.template()}</a>
    `;
  }
  renderButton() {
    const deleteBtn = this.addChild(Button, {
      text: "삭제하기",
      variant: "secondary",
      onClick: (e) => this.handleDeleteItem(e),
      classList: ["w-full"],
      id: "delete-btn"
    });
    const cancelBtn = this.addChild(Button, {
      text: "닫기",
      variant: "primary",
      classList: ["w-full"],
      id: "cancel-btn"
    });
    return `
      <div class="w-full flex gap-16 flex-row justify-between items-center">
        ${deleteBtn.template()}
        ${cancelBtn.template()}
      </div>
    `;
  }
  handleToggleFavorite() {
    this.props.isFavorite = !this.props.isFavorite;
    RestaurantFacade.toggleFavorite(this.props.id);
    document.dispatchEvent(new CustomEvent("itemChange"));
  }
  handleDeleteItem(e) {
    e.stopPropagation();
    RestaurantFacade.removeById(this.props.id);
  }
  setEvent() {
    if (!this.props) return;
    document.removeEventListener("click", this.handleFavoriteClick);
    this.handleFavoriteClick = (e) => {
      const favoriteButton = e.target.closest("#favorite-detail-button");
      if (favoriteButton && favoriteButton.dataset.id == this.props.id) {
        e.preventDefault();
        this.handleToggleFavorite();
        favoriteButton.innerHTML = this.renderFavoriteIcon();
      }
    };
    document.addEventListener("click", this.handleFavoriteClick);
  }
  template() {
    return `
    <div id="lunch-item-detail" class="flex flex-col items-start gap-16 mt-32 mb-32">
      <div class="flex flex-row items-start justify-between w-full">
        <div class="flex flex-col gap-16">
        ${this.renderCircleIcon()}
        ${this.renderStoreName()}
        </div>
        <button type="button" id="favorite-detail-button" data-id="${this.props.id}" style="background: none; border: none;">
          ${this.renderFavoriteIcon()}
        </button>
      </div>
      ${this.renderDistance()}
      ${this.renderDescription()}
      ${this.renderLink()}
      ${this.renderButton()}
    </div>`;
  }
}
const BOTTOM_SHEET_MODES = {
  FORM: "FORM",
  DETAIL: "DETAIL"
};
class BottomSheet extends Component {
  setDefaultProps() {
    this.props = {
      isOpen: false,
      onAdd: () => {
      }
    };
  }
  initState() {
    var _a;
    this.state = {
      isOpen: ((_a = this.props) == null ? void 0 : _a.isOpen) || false,
      mode: BOTTOM_SHEET_MODES.FORM,
      selectedItem: null
    };
  }
  open(mode, selectedItem = null) {
    this.setState({
      isOpen: true,
      mode,
      selectedItem
    });
    this.children = [
      this.addChild(
        mode === BOTTOM_SHEET_MODES.FORM ? LunchForm : LunchItemDetail,
        selectedItem
      )
    ];
    this.render();
    this.setEvent();
  }
  close() {
    const bottomSheetContainer = document.getElementById("bottom-sheet");
    if (bottomSheetContainer) {
      bottomSheetContainer.innerHTML = "";
    }
  }
  findChildByType(type) {
    return this.children.find((child) => child instanceof type);
  }
  handleOverlayClickEvent() {
    const overlay = document.querySelector("#bottom-sheet-overlay");
    const bottomSheetContent = document.getElementById("bottom-sheet-content");
    overlay == null ? void 0 : overlay.addEventListener("click", (e) => {
      if (!bottomSheetContent.contains(e.target)) {
        this.close();
      }
    });
  }
  handleCancelButtonClickEvent() {
    const cancelButton = document.getElementById("cancel-btn");
    cancelButton == null ? void 0 : cancelButton.addEventListener("click", () => {
      this.close();
    });
  }
  handleFormSubmitEvent() {
    const lunchForm = document.getElementById("lunch-form");
    lunchForm == null ? void 0 : lunchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit(e);
    });
  }
  handleDeleteButtonClickEvent() {
    const lunchItemDetail = document.getElementById("delete-btn");
    lunchItemDetail == null ? void 0 : lunchItemDetail.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleDeleteItem(e);
    });
  }
  handleDeleteItem(e) {
    const lunchItemDetail = this.findChildByType(LunchItemDetail);
    lunchItemDetail.handleDeleteItem(e);
    this.close();
    document.dispatchEvent(new CustomEvent("itemChange"));
  }
  handleFormSubmit(e) {
    const lunchForm = this.findChildByType(LunchForm);
    try {
      lunchForm.handleSubmit(e);
      this.props.onAdd();
      this.close();
    } catch (e2) {
      alert(e2.message);
    }
    document.dispatchEvent(new CustomEvent("itemChange"));
  }
  setEvent() {
    this.handleOverlayClickEvent();
    this.handleCancelButtonClickEvent();
    this.handleFormSubmitEvent();
    this.handleDeleteButtonClickEvent();
  }
  template(isOpen = this.props.isOpen) {
    if (!isOpen) return "";
    const height = this.state.mode === "DETAIL" ? "auto" : "80%";
    return `
      <div id="bottom-sheet-open">
        <div 
          id="bottom-sheet-overlay"
          class="w-full h-full fixed top-0 left-0"
          style="background-color: rgba(0, 0, 0, 0.5);"
        />
        <div
          class="w-full fixed flex justify-center bottom-0 left-0"
          style="height: ${height}%; z-index: 50;"
        >
          <div 
            id="bottom-sheet-content"
            class="relative max-w-390 w-full flex flex-col bg-white overflow-y px-16 box-border"
            style="z-index: 50; border-top-left-radius: 16px; border-top-right-radius: 16px; 
              animation: slideUp 300ms ease-out forwards;"
          >
            ${this.children.map((child) => child.template()).join("")}
          </div>
        </div>
      </div>
    `;
  }
  render(props) {
    super.render(props, "#bottom-sheet");
  }
}
const storeData = [
  {
    id: 1,
    storeName: "한식당",
    distance: 5,
    category: "한식",
    description: "맛있는 한식당",
    link: "https://www.google.com",
    isFavorite: false
  },
  {
    id: 2,
    storeName: "양식당",
    distance: 10,
    category: "양식",
    description: "파스타",
    link: "https://www.google.com",
    isFavorite: false
  }
];
const initializeLocalStorage = () => {
  if (RestaurantFacade.getAll().length === 0) {
    RestaurantFacade.importData(storeData);
  }
};
addEventListener("load", () => {
  initializeLocalStorage();
  const layout = new Layout();
  const bottomSheet = new BottomSheet();
  layout.addChild(Header, {
    title: "점심 뭐먹지",
    iconName: "add-button",
    onIconClick: () => bottomSheet.open(BOTTOM_SHEET_MODES.FORM)
  });
  layout.addChild(Tab, {
    tabs: ["모든 음식점", "자주 가는 음식점"],
    activeIndex: 0,
    onItemClick: (item) => bottomSheet.open(BOTTOM_SHEET_MODES.DETAIL, item)
  });
  layout.render();
});
