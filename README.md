# testappnode
Перед запуском web-приложения нужно установить npm-зависимости, с помощью команды:</br>
`npm install`</br>
Запуск осуществляется с помощью команды:
`npm start`

Делал это тестовое:<br>
Задание 1 (сортировка статей)
На входе:
1. json вида
```{
	"kind": "Listing",
	"data": {
    	"modhash": "",
    	"children": [{
        	"kind": "t3",
        	"data": {
            	"domain": "rathercurio.us",
            	"banned_by": null,
            	"media_embed": {},
            	"subreddit": "javascript",
            	"selftext_html": null,
            	"selftext": "",
            	"likes": null,
            	"secure_media": null,
            	"saved": false,
            	"id": "1n4m6p",
            	"secure_media_embed": {},
            	"clicked": false,
            	"stickied": false,
            	"author": "masterJ",
            	"media": null,
            	"score": 16,
            	"approved_by": null,
            	"over_18": false,
            	"hidden": false,
            	"thumbnail": "",
            	"subreddit_id": "t5_2qh30",
            	"edited": false,
            	"link_flair_css_class": null,
            	"author_flair_css_class": null,
            	"downs": 2,
            	"is_self": false,
            	"permalink": "/r/javascript/comments/
1n4m6p/functional_mixins_and_advice_in_javascript/",
            	"name": "t3_1n4m6p",
            	"created": 1380169452.0,
            	"url": "http://rathercurio.us/functional-mixins-and-advice-in-javascript",
            	"author_flair_text": null,
            	"title": "Functional Mixins and Advice in JavaScript",
            	"created_utc": 1380140652.0,
            	"link_flair_text": null,
            	"ups": 18,
            	"num_comments": 8,
            	"num_reports": null,
            	"distinguished": null
        	}
    	}, {
        	"kind": "t3",
        	"data": {
            	"domain": "bunselmeyer.net",
            	"banned_by": null,
            	"media_embed": {},
            	"subreddit": "javascript",
            	"selftext_html": null,
            	"selftext": "",
            	"likes": null,
            	"secure_media": null,
            	"saved": false,
            	"id": "1n46by",
            	"secure_media_embed": {},
            	"clicked": false,
            	"stickied": false,
            	"author": "tpk1024",
            	"media": null,
            	"score": 14,
            	"approved_by": null,
            	"over_18": false,
            	"hidden": false,
            	"thumbnail": "",
            	"subreddit_id": "t5_2qh30",
            	"edited": false,
            	"link_flair_css_class": null,
            	"author_flair_css_class": null,
            	"downs": 0,
            	"is_self": false,
            	"permalink": "/r/javascript/comments/1n46by/template_inheritance_for_angular_js/",
            	"name": "t3_1n46by",
            	"created": 1380158376.0,
            	"url": "http://www.bunselmeyer.net/#!/thoughts/angular-blocks",
            	"author_flair_text": null,
            	"title": "Template inheritance for Angular JS",
            	"created_utc": 1380129576.0,
            	"link_flair_text": null,
            	"ups": 14,
            	"num_comments": 0,
            	"num_reports": null,
            	"distinguished": null
        	}
    	}
....
```
целиком он тут http://www.reddit.com/r/javascript/.json (это отображение страницы http://www.reddit.com/r/javascript)
2. направление и поле (дата создания, баллы) для сортировки выходных данных
3. выходной формат (csv, sql) и доп. параметры для форматтера (разделитель для csv, имя таблицы и полей для sql и пр.)
 
на выходе мы всегда отображаем следующие поля:
id, title, utc creation date, score
 
например для статей отсортированных по баллам (в порядке убывания) в формате csv должно получиться, что-то вроде:
"1n3jj3", "Must.js — An assertion library with BDD syntax (awesome.must.be.true()). Ships with many expressive matchers. Honors RFC 2119 by using MUST. Good stuff and well tested.", "25.09.2013 16:09:00", 26
"1n46by", "Template inheritance for Angular JS", "26.09.2013 05:09:00", 14
"1n3bpg", "Why Lavaca is the only sane HTML5 mobile development framework out there (and why Sencha Touch sucks)", "25.09.2013 12:09:00", 8
....
 
 

Задание 2 (агрегация)
Имея на входе тот же json и выходной формат на выходе мы должны получить информацию по количеству статей для каждого домена отсортированную по убыванию, т.е. поля:
domain, articles count (количество статей на домене), score summ (сумма баллов всех статей домена)
например в csv:
"github.com", 13, 123
"rathercurio.us", 10, 55
"bunselmeyer.net", 5, 40
 
 
Оба задания стоит рассматривать как часть целого - т.е. нужно организовать расширяемую систему для обработки json данных с reddit.com.
Нужно предусмотреть (но не делать) возможность расширения набора стратегий обработки json'а (сейчас это сортировка и агрегация) и расширения набора выходных форматов.
 
Вариант реализации: веб-приложение, которому можно скормить url с reddit.com, указать  операцию (сортировка, агрегация), формат  + доп. параметры (например разделитель для csv) в результате получить данные в желаемом формате.
 
Технологии
 
http://nodejs.org/docs/v4.4.0/api/
 
Пакеты с версиями из npm, мин. набор:
		```"express": "4.x.x",
		"twostep": "0.4.1",
		"jade": "1.x.x",
		"conform": "0.2.12",
		"underscore": "1.8.3"```
 
если нужна база, то mongodb 3.2, драйвера:
		```"mongodb": "2.1.4",
		"mongodbext": "2.0.1",```
 
Сode style
 
https://github.com/2do2go/code-style/blob/master/js.md
 
 
 

Задание 3
 
Дан массив объектов с полями id (уникальный идентификатор) и parentId (идентификатор родителя). Для входных данных верно следующее: индекс ребенка всегда больше индекса родителя в исходном массиве.

Задача: превратить массив "плоских" объектов в массив объектов с вложенными детьми (поле children).
 
Исходные данные
 ```
[
	{id: 1, parentId: 0},
	{id: 2, parentId: 0},
	{id: 3, parentId: 1},
	{id: 4, parentId: 1},
	{id: 5, parentId: 2},
	{id: 6, parentId: 4},
	{id: 7, parentId: 5}
];
 
должны превратиться в<br>
 

[
	{
    	"id": 1,
    	"parentId": 0,
    	"children": [
        	{
            	"id": 3,
            	"parentId": 1
        	},
        	{
            	"id": 4,
            	"parentId": 1,
            	"children": [
                	{
                    	"id": 6,
                    	"parentId": 4
                	}
            	]
        	}
    	]
	},
	{
    	"id": 2,
    	"parentId": 0,
    	"children": [
        	{
            	"id": 5,
            	"parentId": 2,
            	"children": [
                	{
                    	"id": 7,
                    	"parentId": 5
                	}
            	]
        	}
    	]
	}
]
```
 

