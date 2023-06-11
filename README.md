# M-Collapse (v.1)

JS: Collapse or Accordion (Vanilla Plugin)

<a href="https://t.me/bichurinet" target="_blank">
   <img src="./assets/telegram.svg" height="24px">
  Contact Me
</a>

## HTML-разметка

- атрибут <b>m-collapse="ЛЮБОЕ_ИМЯ"</b> (обертка, где лежат элементы)
- <b>m-collapse-container</b> (элемент)
- <b>m-collapse-header</b> (кликабельная часть для открытия/скрытия контента)
- <b>m-collapse-body</b> (по умолчанию контент скрыт)
- <b>m-collapse-body="visible"</b> (по умолчанию контент открыт)
- <b>m-collapse-arrow</b> (возможность навесить анимацию, если есть своя кастомная "стрелочка вниз")

```html
<div m-collapse="collapse">
  <div m-collapse-container>
    <div m-collapse-header>{ТЕКСТ КНОПКИ}</div>
    <div m-collapse-body>{ТЕКСТ КОНТЕНТА}</div>
  </div>
  <div m-collapse-container>
    <div m-collapse-header>{ТЕКСТ КНОПКИ}</div>
    <div m-collapse-body="visible">{ТЕКСТ КОНТЕНТА}</div>
  </div>
</div>
```

## Подключение и инциализация JavaScript

```js
<script src="./src/m-collapse.js"></script>; //example
//example file main.js
new MCollapse("collapse", {}).init();
```

## Параметры плагина

- <b>accordion: true</b> (<i>переходит в режим аккордиона, при нажатии все элементы скрываются, показывается нужный элемент, который был выбран</i>)
- <b>containerClick: true</b> (<i>клик на открытие/скрытие контента весит на элементе с атрибутом m-collapse-container</i>)
- <b>bodyClick: true</b> (<i>элемент будет скрываться, если нажатие произошло на элементе с атрибутом m-collapse-body</i>)
- <b>visibleAll: true</b> (<i>по умолчанию у элементов контент открыт</i>)
- <b>animateDurationOpen: 200</b> (<i>длительность анимации открытия контента, задается в милисекундах</i>)
- <b>animateDurationСlose: 200</b> (<i>длительность анимации скрытия контента, задается в милисекундах</i>)
- <b>animateDurationArrow: 200</b> (<i>длительность анимации переворота стрелочки в нужное положение, задается в милисекундах</i>)

```js
// параметры по умолчанию
new MCollapse("collapse", {
  accordion: false,
  containerClick: false,
  bodyClick: false,
  visibleAll: false,
  animateDurationOpen: 200, //ms
  animateDurationClose: 200, //ms
  animateDurationArrow: 200, //ms
}).init();
```

## Метод .destory()

Если ваш компонент будет проивзодить unMount (удалятся) из DOM <br>
можно вызвать метод destory(), удалит всех слушателей событий данного плагина

```js
const collapse = new MCollapse("collapse").init();
// if component destory
collapse.destroy();
```
