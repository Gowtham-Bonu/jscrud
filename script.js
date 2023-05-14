
var real_row = null
var msg = document.getElementById("msg")
const buttons = document.querySelectorAll("button")
var idlist = []

buttons.forEach(button => {
    button.addEventListener("click", (event) => {
        table = document.getElementById('table')
        if(event.target.value=="id_asc"){
            idlist.sort(function(a, b) {
                return a.id - b.id;
            });
            console.log(idlist)
        }else if(event.target.value=="name_asc"){
            idlist.sort(function(a, b) {
                var nameA = a.name.toLowerCase();
                var nameB = b.name.toLowerCase();
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              });
            console.log(idlist)
        }else{
            idlist.sort(function(a, b) {
                return a.price - b.price;
            });
        }
        localStorage.setItem('product', JSON.stringify(idlist))
        var rowCount = table.rows.length;
        for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
        }
        idlist.forEach(function(element) {
        data_arr = [element.name, element.price, element.desc,element.img, element.id ]
        createTable(data_arr)
        });
    }
    )
})

function destroy(get_row){
    msg.innerHTML = "deleted a record!"
    real_row = get_row.parentElement.parentElement;
    document.getElementById('table').deleteRow(real_row.rowIndex)
    delObj = idlist.find(obj => obj.id == real_row.cells[0].innerHTML)
    idlist.splice(idlist.indexOf(delObj), 1)
    localStorage.setItem('product', JSON.stringify(idlist))
    real_row = null
}

function edit(get_row){
    //var regex = /<img.*?src="(.*?)"/;
    real_row = get_row.parentElement.parentElement;
    document.getElementById("ProductName").value = real_row.cells[1].innerHTML
    document.getElementById("Image").value = ""
    document.getElementById("Price").value = real_row.cells[3].innerHTML
    document.getElementById("Description").value = real_row.cells[4].innerHTML
    //link = regex.exec(real_row.cells[2].innerHTML)
    // 
    // idlist.slice(idlist.indexOf(editObj), 1)
    // localStorage.setItem('product', JSON.stringify(idlist))
    // console.log(idlist)
}

function update(){
    real_row.cells[1].innerHTML = document.getElementById("ProductName").value
    real_row.cells[2].innerHTML = `<img src = "${document.getElementById("Image").value }"  style="height: 100px; width: 100px;""></img>`
    real_row.cells[3].innerHTML = document.getElementById("Price").value
    real_row.cells[4].innerHTML = document.getElementById("Description").value
    editObj = idlist.find(obj => obj.id == real_row.cells[0].innerHTML)
    editObj.name = document.getElementById("ProductName").value
    editObj.image = document.getElementById("Image").value
    editObj.price = document.getElementById("Price").value
    editObj.desc = document.getElementById("Description").value
    localStorage.setItem('product', JSON.stringify(idlist))
    real_row = null
}

function createTable(table_data){
    var myRow = table.insertRow();
    var cell0 = myRow.insertCell(0)
    cell0.classList.add("text-center")
    cell0.innerHTML = table_data[4]
    var cell1 = myRow.insertCell(1)    
    cell1.classList.add("text-center")
    cell1.innerHTML = table_data[0]
    var cell2 =  myRow.insertCell(2)
    cell2.classList.add("text-center")
    cell2.innerHTML = `<img src = "${table_data[3]}" style="height: 100px; width: 100px;"></img>`
    var cell3 = myRow.insertCell(3)
    cell3.classList.add("text-center")
    cell3.innerHTML = table_data[1]
    var cell4 = myRow.insertCell(4)
    cell4.classList.add("text-center")
    cell4.innerHTML = table_data[2]
    var cell5 = myRow.insertCell(5)
    cell5.classList.add("text-center")
    cell5.innerHTML = `<button onclick=edit(this)  class="btn btn-primary">edit</button>
                                    <button onclick=destroy(this)  class="btn btn-primary">delete</button>`
}

function storeInLocal(form_data){
    var id = idlist.length ? idlist[idlist.length-1].id+1 : 0
    product = {
        id: id,
        name: form_data[0],
        img: form_data[3],
        price: form_data[1],
        desc: form_data[2]
    }
    if(real_row === null){
        idlist.push(product)
    }
    localStorage.setItem('product', JSON.stringify(idlist))
    var sid = localStorage.setItem("ID", id)
    var sname = localStorage.setItem("ProductName", form_data[0])
    var sprice = localStorage.setItem("Price", form_data[1])
    var sdesc = localStorage.setItem("Description", form_data[2])
    var simage = localStorage.setItem("Image", form_data[3])
    var rid = localStorage.getItem("ID", sid)
    var rname = localStorage.getItem("ProductName", sname)
    var rprice = localStorage.getItem("Price", sprice)
    var rdesc = localStorage.getItem("Description", sdesc)
    var rimage = localStorage.getItem("Image", simage)
    ret_arr = [rname, rprice, rdesc,rimage, rid]
    if (ret_arr.includes("")){
        return false
    }else{
        return ret_arr
    }
}

function getdata(){
    var name = document.getElementById("ProductName").value
    var price = document.getElementById("Price").value
    var description = document.getElementById("Description").value
    var image = document.getElementById("Image").value
    data_arr = [name, price, description,image ]
    return data_arr
}

function Submit(){
    form_data = getdata()
    ret_data = storeInLocal(form_data)
    storedItem = localStorage.getItem("product")
    parsedItem = JSON.parse(storedItem)
    if (ret_data){
        if (typeof ret_data[0] !== "string" || !(isNaN(ret_data[0]))){
            msg.innerHTML = "Product Name should be a name!"
        }else if(isNaN(ret_data[1])){
            msg.innerHTML = "Price should be a number!"
        }else{
            msg.innerHTML = ""
            if (real_row === null){
                msg.innerHTML = "created a record!"
                createTable(ret_data)
                console.log(idlist)
            }else{
                msg.innerHTML = "updated a record!"
                update()
                console.log(idlist)
            }
            document.getElementById("form").reset()
            }
    }else{
        msg.innerHTML = "please fill all fields!"
    }
}