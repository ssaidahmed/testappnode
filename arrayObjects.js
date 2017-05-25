	
var mass = [

	{id: 1, parentId: 0},
	{id: 2, parentId: 0},
	{id: 3, parentId: 1},
	{id: 4, parentId: 1},
	{id: 5, parentId: 2},
	{id: 6, parentId: 4},
	{id: 7, parentId: 5},
	{id: 17, parentId: 4},
	{id: 12, parentId: 17},
	{id: 112, parentId: 1}
	
];
function f(index, obj, mass){ // рекурсивная функция вызывает себя , если совпадают id и parentId объектов
		
		for(var i = index; i < mass.length; i++){
			
			
			if(mass[i]['parentId'] === obj.id){ // если есть совпадение, строим объект такой же, как в ячейке массива
			
				var obj1 = new Object();
				obj1.id = mass[i]['id'];
				obj1.parentId = mass[i]['parentId'];
				
				if (!("children" in obj)) {
					obj.children=[];
				}
								
				 mass.splice(i, 1); // удаляем элемент массива. можно и так: delete mass[i], но потом придется чистить undefined ячейки, еще раз проходить по массиву. не проверял, какой из методов быстрее
				
			    obj.children.push(f(i, obj1, mass));
				i=i-1;
				
			}
				
		}
		
		
		return  obj;
	}


function treeObjects(mass){
	for(var o in mass){
		f(0, mass[o], mass);
	}
	return mass;
}


module.exports = treeObjects;
