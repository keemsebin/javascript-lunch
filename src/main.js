import {
  Icon,
  Text,
  Header,
  Layout,
  BottomSheet,
} from "./components/common/index.js";
import { LunchList, LunchItem, LunchForm } from "./components/feature/index.js";

addEventListener("load", () => {
  const layout = new Layout();
  const bottomSheet = new BottomSheet();

  const header = layout.addChild(Header);
  const lunchList = layout.addChild(LunchList);

  header.setProps({
    title: "점심 뭐먹지",
    iconName: "add-button",
    onIconClick: () => bottomSheet.open(),
  });

  bottomSheet.setProps({
    onAdd: (data) => {
      const newLunchItem = new LunchItem();
      newLunchItem.setProps(data);
      lunchList.addLunchItem(newLunchItem);
    },
  });

  bottomSheet.addChild(LunchForm);

  layout.render();
});
