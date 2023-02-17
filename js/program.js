$(function () {
    if(!isLogin()){
        window.location.replace("http://127.0.0.1:5500/html/login.html");
  
    }
    $(".header").load("header.html",function(){
        document.getElementById("loginUsername").innerHTML=storage.getItem("USERNAME")
        if(storage.getItem("ROLE")!="ADMIN"){

            document.getElementById("listDepartment").style.display="none";
            document.getElementById("listAccount").style.display="none";
        }
    });
    $(".main").load("home.html");
    $(".footer").load("footer.html");
});
function isLogin() {
   
    if(storage.getItem("ID")){
        return true;
    }
   
        return false; 
    
}
function logout() {
    storage.removeItem("ID")
    storage.removeItem("FULL_NAME")
    storage.removeItem("USERNAME")
    storage.removeItem("PASSWORD")
    storage.removeItem("ROLE")
    window.location.replace("http://127.0.0.1:5500/html/login.html");



}

function clickNavHome() {
    $(".main").load("home.html").load("viewlistaccounts.html");

}

function clickNavViewListDepartments() {
    $(".main").load("viewlistdepartments.html", function () {
        buildTable();
    });
}

var departments = [];
var nameDepartments = [];
var currentPageDepartment = 1;
var sortFieldDepartment = "totalMember";
var isAscDepartment = false;
var searchDepartment = "";
var filterType = "";
var filterCreatedDateMin = "";
var filterCreatedDateMax = "";

function getListDepartments() {
    url = "http://localhost:8080/api/v1/departments"
    url += "?page=" + currentPageDepartment + "&size=" + size;
    url += "&sort=" + sortFieldDepartment + "," + (isAscDepartment ? "asc" : "desc");
    if (searchDepartment) {
        url += "&search=" + searchDepartment;
    }
    if (filterType) {
        url += "&type=" + filterType;

    }
    if (filterCreatedDateMin) {
        url += "&createdDateMin=" + filterCreatedDateMin;

    }
    if (filterCreatedDateMax) {
        url += "&createdDateMax=" + filterCreatedDateMax;

    }

    // call API from server
    $.ajax({
        url: url,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
        },
        success: function (data, textStatus, xhr) {
            // reset list employees
            departments = [];
            departments = data.content;
            if (filterType !== "") {
                document.getElementById("filterType").value = filterType;
            }
            if (searchDepartment !== "") {
                document.getElementById("inputSearchDepartment").value = searchDepartment;
            }
            if (filterCreatedDateMax !== "") {
                document.getElementById("inputFilterCreatedDateMax").value = filterCreatedDateMax;
            }
            if (filterCreatedDateMin !== "") {
                document.getElementById("inputFilterCreatedDateMin").value = filterCreatedDateMin;
            }
            pagingTableDepartment(data.totalPages);
            renderSortUIDepartment();
            fillDepartmentToTable();

        },
        error(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {
                window.location.href = "http://127.0.0.1:5500/html/forbidden.html";
            }
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
    // $.get("http://localhost:8080/api/v1/departments", function (data, status) {

    //     // reset list employees
    //     departments = [];

    //     // error
    //     if (status == "error") {
    //         // TODO
    //         alert("Error when loading data");
    //         return;
    //     }

    //     // success
    //     departments = data;
    //     fillDepartmentToTable();
    // });
}


function fillDepartmentToTable() {
    departments.forEach(function (item, index) {

        $('#getlist').append(
            //var iteminto='"'+item.name+'"';
            '<tr>' +
            '<td><input  id="checkboxDepartment-' + index + '" type="checkbox" onclick="onChangeCheckboxIteamDepartment()"></td>' +

            '<td>' + item.name + '</td>' +
            '<td>' + item.totalMember + '</td>' +
            '<td>' + item.createdDate + '</td>' +
            '<td>' + item.type + '</td>' +
            '<td>' +
            // '<a class="add" title="add" data-toggle="tooltip" onclick="openAddListAccountModal(' + item.id + ')"><i class="fa fa-add"></i></a>' +
           ' <a style="float: right;" type="button"  onclick="openAddModalAccountTodepartment('+item.id+')"><i class="fa fa-plus" title="Add new"></i> </a>'+

            '<a class="edit" title="Edit" data-toggle="tooltip" onclick="openUpdateModal(' + item.id + ')"><i class="material-icons">&#xE254;</i></a>' +
            '<a class="delete" title="Delete" data-toggle="tooltip" onClick="openConfirmDelete(' + item.id + ')"><i class="material-icons">&#xE872;</i></a>' +
            '</td>' +
            '</tr>')
           
    });
}

function buildTable() {
    $('tbody').empty();
    getListDepartments();
}

function pagingTableDepartment(pageAmount) {
    var pagingStr = "";
    if (pageAmount > 1 && currentPageDepartment != 1) {
        pagingStr +=
            '<li class="page-item">' +
            '<a class="page-link" onclick="onChangePreDepartment()"><i class="fa fa-arrow-left"></i></a>' +
            '</li>';

    }
    for (let i = 0; i < pageAmount; i++) {
        pagingStr += '<li class="page-item ' + (currentPageDepartment == i + 1 ? "active" : " ") + '">' +
            '<a class="page-link" onClick="changePageDepartment(' + (i + 1) + ') ">' + (i + 1) + '</a>' +
            '</li>';

    }
    if (pageAmount > 1 && currentPageDepartment < pageAmount) {
        pagingStr += '<li class="page-item">' +
            '<a class="page-link" onclick="onChangeNextDepartment(' + currentPageDepartment + ')"><i class="fa fa-arrow-right"></i></a>' +
            '</li>';

    }
    $('#paginationDepartments').empty();

    $('#paginationDepartments').append(pagingStr);


}
function resetPagingDepartment() {
    currentPageDepartment = 1;
    size = 10;
}


function changePageDepartment(page) {
    if (page == currentPageDepartment) {
        return;
    }
    currentPageDepartment = page;
    buildTable();
}
function onChangePreDepartment() {
    changePageDepartment(currentPageDepartment - 1);
}
function onChangeNextDepartment(page) {

    currentPageDepartment = page + 1;
    buildTable();
}

function changeSortDepartment(field) {
    if (field == sortFieldDepartment) {
        isAscDepartment = !isAscDepartment;

    }
    else {
        isAscDepartment = true;
        sortFieldDepartment = field;
    }
    console.log(isAscDepartment)
    buildTable();


}

function resetSortDepartment() {
    sortFieldDepartment = "totalMember";
    isAscDepartment = false;
}
function filterDepartment(){
    var inputType = document.getElementById("filterType").value
    console.log(inputType)
    if (inputType != filterType) {
        filterType = inputType;
    }
    var inputCreateddateMin = document.getElementById("inputFilterCreatedDateMin").value
    console.log(inputCreateddateMin)
    if (inputCreateddateMin != filterCreatedDateMin) {
        filterCreatedDateMin = inputCreateddateMin;
    }
    var inputCreateddateMax = document.getElementById("inputFilterCreatedDateMax").value
    if (inputCreateddateMax != filterCreatedDateMax) {
        filterCreatedDateMax = inputCreateddateMax;
    }
    resetPagingDepartment();
    buildTable();
}
function refreshDepartment(){
     currentPageDepartment = 1;
     sortFieldDepartment = "totalMember";
     isAscDepartment = false;
     searchDepartment = "";
     filterType = "";
     filterCreatedDateMin = "";
     filterCreatedDateMax = "";
    resetTableDepartment();
    buildTable();
}
function handelKeyUpForSearchDepartment(event){
   
        //number enter 13
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            searchHandelDepartment();
        }
    
    

}
function searchHandelDepartment() {
    var inputSearch = document.getElementById("inputSearchDepartment").value
    if (inputSearch != searchDepartment) {
        searchDepartment = inputSearch;
        resetPagingDepartment();
        buildTable();
    }
    // var inputType = document.getElementById("filterType").value
    // console.log(inputType)
    // if (inputType != filterType) {
    //     filterType = inputType;
    // }
    // var inputCreateddateMin = document.getElementById("inputFilterCreatedDateMin").value
    // console.log(inputCreateddateMin)
    // if (inputCreateddateMin != filterCreatedDateMin) {
    //     filterCreatedDateMin = inputCreateddateMin;
    // }
    // var inputCreateddateMax = document.getElementById("inputFilterCreatedDateMax").value
    // if (inputCreateddateMax != filterCreatedDateMax) {
    //     filterCreatedDateMax = inputCreateddateMax;
    // }
  

}
function resetSearchDepartment() {
    searchDepartment = "";

    document.getElementById("inputSearchDepartment").value = "";
    filterType = "";

    document.getElementById("filterType").value = "";
    filterCreatedDateMax = "";

    document.getElementById("inputFilterCreatedDateMax").value = "";
    filterCreatedDateMin = "";

    document.getElementById("inputFilterCreatedDateMin").value = "";

}
function openAddAccountModalToDepartment(){
    $('#myModalAddAccount').modal('show');
}
function fillAccountForAddDepartment(){
    document.getElementById("tbody").innerHTML="";
    accounts.forEach(function (items, index) {
        $('#tbody').append(
            '<tr>' +
            //'<td>' + items.username + '</td>' +
            '<td><input  id="checkbox-' + index + '" type="checkbox" "></td>' +
            '<td>' + items.username + '</td>' +
            '<td>' + items.fullName + '</td>' +
            '<td>' + items.role + '</td>' +
          
            '</tr>')
    });
}
function openAddModalAccountTodepartment(){
    $.ajax({
        url: "http://localhost:8080/api/v1/accounts/getlistNull" ,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
        },
        success: function (data, textStatus, xhr) {
            // success
            accounts = [];
            accounts = data;
            
            openAddAccountModalToDepartment();
            fillAccountForAddDepartment();
            // resetFormUpdateAccount();
            // fill data
           

        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function openAddDepartmentModal() {
    resetFormAdd();
    openModal();
}
function resetFormUpdateDepartment() {

    document.getElementById("create_date").style.display = "block";
    document.getElementById("label-create_date").style.display = "block";
    document.getElementById("checkName").style.display = "none";
    document.getElementById("checkType").style.display = "none";

}
function resetFormDeleteDepartment() {

    document.getElementById("checkbox-all-department").checked = "false";
}

function resetFormAdd() {
    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("create_date").style.display = "none";

    document.getElementById("label-create_date").style.display = "none";
    document.getElementById("checkType").style.display = "none"
    document.getElementById("checkName").style.display = "none";
    document.getElementById("typeDepartment").value = "";

}

function renderSortUIDepartment() {
    var sortTypeDeClazz = isAscDepartment ? "fa-sort-asc" : "fa-sort-desc";
    console.log(sortTypeDeClazz)
    // const element = document.getElementById("usernameicon");
    //         console.log(element.classList);
    // document.getElementById("heading-usename").classList.add("fa fa-fw fa-sort");
    switch (sortFieldDepartment) {
        case 'name':
            changeIconSortDepartment("nameiconsort", sortTypeDeClazz);
            changeIconSortDepartment("totalMembericonsort", "fa-sort");
            changeIconSortDepartment("created_dateiconsort", "fa-sort");
            changeIconSortDepartment("typeiconsort", "fa-sort");

            break;

        case 'totalMember':
            changeIconSortDepartment("totalMembericonsort", sortTypeDeClazz);
            changeIconSortDepartment("nameiconsort", "fa-sort");
            changeIconSortDepartment("created_dateiconsort", "fa-sort");
            changeIconSortDepartment("typeiconsort", "fa-sort");
            break;

        case 'createdDate':
            changeIconSortDepartment("created_dateiconsort", sortTypeDeClazz);
            changeIconSortDepartment("totalMembericonsort", "fa-sort");
            changeIconSortDepartment("nameiconsort", "fa-sort");
            changeIconSortDepartment("typeiconsort", "fa-sort");
            break;

        case 'type':
            changeIconSortDepartment("typeiconsort", sortTypeDeClazz);
            changeIconSortDepartment("totalMembericonsort", "fa-sort");
            changeIconSortDepartment("created_dateiconsort", "fa-sort");
            changeIconSortDepartment("nameiconsort", "fa-sort");
            break;


        default:

            changeIconSortDepartment("nameiconsort", "fa-sort");
            changeIconSortDepartment("totalMembericonsort", "fa-sort-desc");
            changeIconSortDepartment("created_dateiconsort", "fa-sort");
            changeIconSortDepartment("typeiconsort", "fa-sort");

            break;

    }

}

function changeIconSortDepartment(idClass, sortTypeDeClazz) {
    document.getElementById(idClass).classList.remove("fa-sort", "fa-sort-asc", "fa-sort-desc");
    document.getElementById(idClass).classList.add(sortTypeDeClazz);
}

function openModal() {
    $('#myModal').modal('show');
}

function hideModal() {
    $('#myModal').modal('hide');
}
function resetCheckErrorDepartment(){
    document.getElementById("checkName").style.display = "none"
    document.getElementById("checkType").style.display = "none"

}
function addDepartment() {

    // get data
    var name = document.getElementById("name").value;
    var type = document.getElementById("typeDepartment").value;
    console.log(name)
    // TODO validate
    // then fail validate ==> return;
    //name unique // data not null
    if (!name || name.length > 50 || !type) {
        resetCheckErrorDepartment();
        if (!name ) {
            document.getElementById("checkName").style.display = "block"
            document.getElementById("checkName").innerHTML = "Name not null!"

        }
        if (name.length > 50 ) {
            document.getElementById("checkName").style.display = "block"
            document.getElementById("checkName").innerHTML = "Name from 1-50 character!"

        }
        if (!type) {
            document.getElementById("checkType").style.display = "block"
            document.getElementById("checkType").innerHTML = "Type not null!"


        }
        return;
    }


    $.ajax({
        url: "http://localhost:8080/api/v1/departments/name/" + name,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
        },
        success: function (data, textStatus, xhr) {
            console.log(data);
            // success
            // hideModal();
            // showSuccessAlert();
            // resetTableDepartment();
            // buildTable();
            if (data) {
                document.getElementById("checkName").innerHTML = "Name exists!"
                document.getElementById("checkType").style.display = "none"
                if (type) {
                    document.getElementById("checkName").style.display = "block"


                }

            }
            else {

                var department = {
                    name: name,
                    type: type
                };

                $.ajax({
                    url: 'http://localhost:8080/api/v1/departments/save',
                    type: 'POST',
                    data: JSON.stringify(department), // body
                    contentType: "application/json", // type of body (json, xml, text)
                    // dataType: 'json', // datatype return
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
                    },
                    success: function (data, textStatus, xhr) {
                        console.log(data);
                        // success
                        hideModal();

                        showSuccessAlert();
                        // resetDeleteCheckbox();

                        resetTableDepartment();

                        buildTable();
                    },
                    error(jqXHR, textStatus, errorThrown) {
                        alert("Error when loading data");
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
            }
        },
        error(jqXHR, textStatus, errorThrown) {
            alert("Error when loading data");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
    // call api

}

var oldName = "";
function openUpdateModal(id) {
    $.ajax({
        url: "http://localhost:8080/api/v1/departments/" + id,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
        },
        success: function (data, textStatus, xhr) {
            // success
            openModal();
            // resetFormUpdateAccount();
            resetFormUpdateDepartment();
            // oldName = data.name;

            // fill data
            document.getElementById("id").value = data.id;
            document.getElementById("name").value = data.name;
            oldName = data.name;
            document.getElementById("create_date").value = data.createdDate;
            document.getElementById("typeDepartment").value = data.type;


        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

    // get index from employee's id


    // fill data


}

function save() {
    var id = document.getElementById("id").value;

    if (id == null || id == "") {
        addDepartment();
    } else {
        updateDepartemnt();
    }
}

function updateDepartemnt() {
    var id = document.getElementById("id").value;
    var name = document.getElementById("name").value;
    var type = document.getElementById("typeDepartment").value;

    // TODO validate
    // then fail validate ==> return;
    if (!name || name.length > 50 || !type) {
        resetCheckErrorDepartment();
        if (!name || name.length > 50) {
            document.getElementById("checkName").style.display = "block"
            document.getElementById("checkName").innerHTML = "Name from 1-50 character!"

        }
        if (!type) {
            document.getElementById("checkType").style.display = "block"
            document.getElementById("checkType").innerHTML = "Type not null!"
        }
        return;
    }
    if (oldName == name) {
        var department = {
            name: name,
            type: type
        };
        // call api
        $.ajax({
            url: 'http://localhost:8080/api/v1/departments/update/' + id,
            type: 'PUT',
            data: JSON.stringify(department), // body
            contentType: "application/json", // type of body (json, xml, text)
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
            },
            // dataType: 'json', // datatype return
            success: function (data, textStatus, xhr) {
                console.log(data);
                // success
                // hideModalAccount();
                // showSuccessAlert();
                // resetTable();
                //  buildTableAccount();
                resetTableDepartment();

                hideModal();
                showSuccessAlert();
                buildTable();
            },
            error(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
        // hideModal();
        // showSuccessAlert();
        // buildTable();

    } else {
        $.ajax({
            url: "http://localhost:8080/api/v1/departments/name/" + name,
            type: 'GET',
            contentType: "application/json",
            dataType: 'json', // datatype return
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
            },
            success: function (data, textStatus, xhr) {
                console.log(data);
                // success
                // hideModal();
                // showSuccessAlert();
                // resetTableDepartment();
                // buildTable();
                if (data) {
                    document.getElementById("checkName").innerHTML = "Name exists!"
                    document.getElementById("checkType").style.display = "none"
                    if (type) {
                        document.getElementById("checkName").style.display = "block"


                    }
                }
                else {

                    var department = {
                        name: name,
                        type: type
                    };
                    // call api
                    $.ajax({
                        url: 'http://localhost:8080/api/v1/departments/update/' + id,
                        type: 'PUT',
                        data: JSON.stringify(department), // body
                        contentType: "application/json", // type of body (json, xml, text)
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
                        },
                        // dataType: 'json', // datatype return
                        success: function (data, textStatus, xhr) {
                            console.log(data);
                            // success
                            // hideModalAccount();
                            // showSuccessAlert();
                            // resetTable();
                            //  buildTableAccount();
                            resetTableDepartment();

                            hideModal();
                            showSuccessAlert();
                            buildTable();
                        },
                        error(jqXHR, textStatus, errorThrown) {
                            console.log(jqXHR);
                            console.log(textStatus);
                            console.log(errorThrown);
                        }
                    });
                }
            },
            error(jqXHR, textStatus, errorThrown) {
                alert("Error when loading data");
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }


}


function openConfirmDelete(id) {
    // get index from employee's id
    var index = departments.findIndex(x => x.id == id);
    var name = departments[index].name;

    var result = confirm("Want to delete " + name + "?");
    if (result) {
        deleteDepartment(id);
    }
}
function onChangeCheckboxAllDepartment() {

    var i = 0;
    while (true) {
        var checkboxDepartment = document.getElementById("checkboxDepartment-" + i)
        if (checkboxDepartment !== undefined && checkboxDepartment !== null) {

            checkboxDepartment.checked = document.getElementById("checkbox-all-department").checked

            i++;
        }
        else {
            break;
        }

    }
}
function resetDeleteCheckboxDepartment() {
    document.getElementById("checkbox-all-department").checked = false;
    //rest iteam
    var i = 0;
    while (true) {
        var checkboxIteamDepartment = document.getElementById("checkboxDepartment-" + i)
        if (checkboxIteamDepartment !== undefined && checkboxIteamDepartment !== null) {
            checkboxIteamDepartment.checked = false;

            i++;
        }
        else {
            break;
        }
    }
}
function resetTableDepartment() {
    resetPagingDepartment();
    resetSortDepartment();
    resetSearchDepartment();
    resetDeleteCheckboxDepartment()
}
function onChangeCheckboxIteamDepartment() {

    var i = 0;
    while (true) {
        var checkboxIteamDepartment = document.getElementById("checkboxDepartment-" + i)
        if (checkboxIteamDepartment !== undefined && checkboxIteamDepartment !== null) {
            if (!checkboxIteamDepartment.checked) {
                document.getElementById("checkbox-all-department").checked = false;
                return;
            }

            i++;
        }
        else {
            break;
        }
    }
    document.getElementById("checkbox-all-departemnt").checked = true;


}

function deleteDepartment(id) {
    // TODO validate
    $.ajax({
        url: 'http://localhost:8080/api/v1/departments/delete/' + id,
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
        },
        success: function (result) {
            // error
            if (result == undefined || result == null) {
                alert("Error when loading data");
                return;
            }

            // success
            showSuccessAlert();
            //resetTable();
            resetTableDepartment();

            buildTable();
        }
    });

}
function deleteAllDepartment() {

    //get checked
    var idsDepartemnt = [];
    var names = [];
    var i = 0;
    while (true) {
        var checkboxIteamDepartment = document.getElementById("checkboxDepartment-" + i)
        if (checkboxIteamDepartment !== undefined && checkboxIteamDepartment !== null) {
            if (checkboxIteamDepartment.checked) {

                idsDepartemnt.push(departments[i].id);
                names.push(departments[i].name);


            }

            i++;
        }
        else {
            break;
        }

    }
    console.log(idsDepartemnt);

    //open confirm 

    var result = confirm("Want to delete " + names + "?");
    if (result) {

        // call api

        $.ajax({
            url: 'http://localhost:8080/api/v1/departments/delete?ids=' + idsDepartemnt,
            type: 'DELETE',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
            },
            success: function (result) {
                // error
                if (result == undefined || result == null) {
                    alert("Error when loading data");
                    return;
                }

                // success
                showSuccessAlert();
                resetTableDepartment();
                buildTable();
            }
        });
    }
}

function showSuccessAlert() {
    $("#success-alert").fadeTo(1000, 500).slideUp(500, function () {
        $("#success-alert").slideUp(500);
    });
}



// Account



function clickNavViewListAccount() {
    $(".main").load("viewlistaccount.html", function () {
        buildTableAccount();
    });
}


var accounts = [];
var currentPage = 1;
var size = 10;
var sortField = "id";
var isAsc = false;
var searchAccount = "";
var filterRole = "";
var filterAccountDepartmentName = "";
function getListAccounts() {

    var url = "http://localhost:8080/api/v1/accounts";

    url += "?page=" + currentPage + "&size=" + size + "&sort=" + sortField + "," + (isAsc ? "asc" : "desc");

    if (searchAccount) {
        url += "&search=" + searchAccount;


    }
    if (filterRole) {
        url += "&role=" + filterRole;
    }
    if (filterAccountDepartmentName) {
        url += "&nameDepartment=" + filterAccountDepartmentName;
    }

    // call API from server
    $.ajax({
        url: url,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
        },
        success: function (data, textStatus, xhr) {
            // reset list employees
            accounts = [];
            accounts = data.content;
            getListDepartmentNameForFilter();
            if (filterRole !== "") {
                document.getElementById("filterRole").value = filterRole;
            }

            resetDeleteCheckbox();
            pagingTable(data.totalPages);
            renderSortUI();
            fillAccountToTable();
        },
        error(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {
                window.location.href = "http://127.0.0.1:5500/html/forbidden.html";
            }
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

}
function pagingTable(pageAmount) {
    var pagingStr = "";
    if (pageAmount > 1 && currentPage != 1) {
        pagingStr +=
            '<li class="page-item">' +
            '<a class="page-link" onclick="onChangePre()"><i class="fa fa-arrow-left"></i></a>' +
            '</li>';

    }
    for (let i = 0; i < pageAmount; i++) {
        pagingStr += '<li class="page-item ' + (currentPage == i + 1 ? "active" : " ") + '">' +
            '<a class="page-link" onClick="changePage(' + (i + 1) + ') ">' + (i + 1) + '</a>' +
            '</li>';

    }
    if (pageAmount > 1 && currentPage < pageAmount) {
        pagingStr += '<li class="page-item">' +
            '<a class="page-link" onclick="onChangeNext(' + currentPage + ')"><i class="fa fa-arrow-right"></i></a>' +
            '</li>';

    }
    $('#pagination').empty();

    $('#pagination').append(pagingStr);


}
function resetPaging() {
    currentPage = 1;
    size = 10;
}


function changePage(page) {
    if (page == currentPage) {
        return;
    }
    currentPage = page;
    buildTableAccount();
}
function onChangePre() {
    changePage(currentPage - 1);
}
function onChangeNext(page) {

    currentPage = page + 1;
    buildTableAccount();
}
function changeSort(field) {
    if (field == sortField) {
        isAsc = !isAsc;

    }
    else {
        isAsc = true;
        sortField = field;
    }
    buildTableAccount();


}

function resetSort() {
    sortField = "id";
    isAsc = false;
}
function resetTable() {
    resetPaging();
    resetSort();
    resetSearch();
    resetDeleteCheckbox();



}

function resetSearch() {
    searchAccount = "";
    document.getElementById("inputSearchAccount").value = "";
    filterAccountDepartmentName = "";
    document.getElementById("filterDepartmentName").value = "";
    filterRole = "";
    document.getElementById("filterRole").value = "";

}
function filterAccount(){
    var srole = document.getElementById("filterRole").value;
    var snameDepartment = document.getElementById("filterDepartmentName").value;
    
    if (filterRole != srole) {
        filterRole = srole;

    }
    if (filterAccountDepartmentName != snameDepartment) {
        filterAccountDepartmentName = snameDepartment;

    }
    resetPaging();
    buildTableAccount();
}
function handelKeyUpForSearchAccount(event) {
    //number enter 13
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        searchHandelAccount();
    }

}

function searchHandelAccount() {
    var s = document.getElementById("inputSearchAccount").value;
   

 
    console.log(s);
    if (searchAccount != s) {
        searchAccount = s;
        resetPaging();
        buildTableAccount();
    }
  
    

}


function renderSortUI() {
    var sortTypeClazz = isAsc ? "fa-sort-asc" : "fa-sort-desc";

    // const element = document.getElementById("usernameicon");
    //         console.log(element.classList);
    // document.getElementById("heading-usename").classList.add("fa fa-fw fa-sort");
    switch (sortField) {
        case 'username':
            changeIconSort("usernameicon", sortTypeClazz);
            changeIconSort("fullNameicon", "fa-sort");
            changeIconSort("roleicon", "fa-sort");
            changeIconSort("departmentNameicon", "fa-sort");

            break;

        case 'fullName':
            changeIconSort("fullNameicon", sortTypeClazz);
            changeIconSort("usernameicon", "fa-sort");
            changeIconSort("roleicon", "fa-sort");
            changeIconSort("departmentNameicon", "fa-sort");
            break;

        case 'role':
            changeIconSort("roleicon", sortTypeClazz);
            changeIconSort("fullNameicon", "fa-sort");
            changeIconSort("usernameicon", "fa-sort");
            changeIconSort("departmentNameicon", "fa-sort");
            break;

        case 'department.name':
            changeIconSort("departmentNameicon", sortTypeClazz);
            changeIconSort("fullNameicon", "fa-sort");
            changeIconSort("roleicon", "fa-sort");
            changeIconSort("usernameicon", "fa-sort");
            break;


        default:

            changeIconSort("usernameicon", "fa-sort");
            changeIconSort("fullNameicon", "fa-sort");
            changeIconSort("roleicon", "fa-sort");
            changeIconSort("departmentNameicon", "fa-sort");

            break;

    }

}

function changeIconSort(id, sortTypeClazz) {
    document.getElementById(id).classList.remove("fa-sort", "fa-sort-asc", "fa-sort-desc");
    document.getElementById(id).classList.add(sortTypeClazz);
}

// function changeIconSort(id, sortTypeClazz) {
//     document.getElementById(id).classList.remove("fa-sort", "fa-sort-asc", "fa-sort-desc");
//     document.getElementById(id).classList.add(sortTypeClazz);
// }

function fillAccountToTable() {
    accounts.forEach(function (items, index) {
        $('tbody').append(
            '<tr>' +
            //'<td>' + items.username + '</td>' +
            '<td><input  id="checkbox-' + index + '" type="checkbox" onclick="onChangeCheckboxIteam()"></td>' +

            '<td>' + items.username + '</td>' +
            '<td>' + items.fullName + '</td>' +
            '<td>' + items.role + '</td>' +
            '<td>' + items.nameDepartment + '</td>' +
            '<td>' +
            
            '<a class="edit" title="Edit" data-toggle="tooltip" onclick="openUpdateAccountModal(' + items.id + ')"><i class="material-icons">&#xE254;</i></a>' +
            '<a class="delete" title="Delete" data-toggle="tooltip" onClick="openConfirmDeleteAccount(' + items.id + ')"><i class="material-icons">&#xE872;</i></a>' +
            '</td>' +
            '</tr>')
    });

}
function getListDepartmentNameForFilter() {
    document.getElementById("filterDepartmentName").innerHTML = '<option  value="">' + '--Mời lựa chọn--' + '</option>';
    nameDepartments.forEach(function (item) {
        if (item === filterAccountDepartmentName) {
            $('#filterDepartmentName').append(
                '<option selected="selected" value="' + item + '">' + item + '</option>'
            )
        }
        else {
            $('#filterDepartmentName').append(
                '<option value="' + item + '">' + item + '</option>'
            )
        }
    });
}
function getListRoleForFilter() {


}

// hiện list name department 
function getListName() {
    // call API from server

    $.ajax({
        url: "http://localhost:8080/api/v1/departments/getAllName",
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
        },
        success: function (data, textStatus, xhr) {
            // reset list employees
            departments = [];
            departments = data;

            nameDepartments = [];

            departments.forEach(function (item) {
                nameDepartments.push(item.name);

            });
            console.log(nameDepartments);
        },

    });
}

function buildTableAccount() {
    $('tbody').empty();
    getListAccounts();
    getListName();

}
function openAddModalAccount() {

    resetFormAddAccount();
    openModalAccount();

}
function openModalAccount() {
    $('#myModalAccount').modal('show');

}

function refrestAccount(){
    currentPage = 1;
    size = 10;
     sortField = "id";
     isAsc = false;
     searchAccount = "";
     filterRole = "";
    filterAccountDepartmentName = "";
    resetTable();
    buildTableAccount();
}
function resetFormAddAccount() {
    document.getElementById("titleModal").innerHTML = "Add Account";
    document.getElementById("id").style.display = "block";
    document.getElementById("label_password").style.display = "block";
    document.getElementById("password").style.display = "block";
    document.getElementById("id").value = "";
    document.getElementById("username").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("password").value = "";
    document.getElementById("role").value = "";
    document.getElementById("nameDepartment").innerHTML = "";
    document.getElementById("nameDepartment").value = "";
    // reset checkerror
    document.getElementById("checkUsername").style.display = "none";
    document.getElementById("checkFirstName").style.display = "none";
    document.getElementById("checkLastName").style.display = "none";
    document.getElementById("checkPassword").style.display = "none";
    document.getElementById("checkRole").style.display = "none";
    document.getElementById("checkNameDepartment").style.display = "none";


    console.log(nameDepartments);
    printListDepartmentModal();

    // document.getElementById("role").value = "";

    //document.getElementById("nameDepartment").value = "";

}
function printListDepartmentModal() {
    document.getElementById("nameDepartment").innerHTML = '<option  disabled="disabled" selected="selected"  value="">' + '--Mời lựa chọn--' + '</option>';

    nameDepartments.forEach(function (item) {

        $('#nameDepartment').append(
            '<option value="' + item + '">' + item + '</option>'
        )

    });
}
function resetFormUpdateAccount() {
    document.getElementById("titleModal").innerHTML = "Update Account";
    document.getElementById("id").style.display = "none";
    document.getElementById("label_password").style.display = "none";
    document.getElementById("password").style.display = "none";
    document.getElementById("nameDepartment").innerHTML = "";
    // reset checkerror
    document.getElementById("checkUsername").style.display = "none";
    document.getElementById("checkFirstName").style.display = "none";
    document.getElementById("checkLastName").style.display = "none";
    document.getElementById("checkPassword").style.display = "none";
    document.getElementById("checkRole").style.display = "none";
    document.getElementById("checkNameDepartment").style.display = "none";
    printListDepartmentModal()

}
var oldUsername = "";
function openUpdateAccountModal(id) {
    $.ajax({
        url: "http://localhost:8080/api/v1/accounts/" + id,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
        },
        success: function (data, textStatus, xhr) {
            // success
            openModalAccount();
            resetFormUpdateAccount();

            // oldName = data.name;
            oldUsername = data.username;
            // fill data
            document.getElementById("id").value = data.id;
            document.getElementById("username").value = data.username;
            document.getElementById("firstName").value = data.firstName;

            document.getElementById("lastName").value = data.lastName;

            //document.getElementById("password").value = data.password;
            //console.log(data.password);
            document.getElementById("role").value = data.role;
           

         document.getElementById("nameDepartment").value = data.nameDepartment;
            
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });


}
function resetCheckError(){
    document.getElementById("checkUsername").style.display = "none";
    document.getElementById("checkFirstName").style.display = "none";
    document.getElementById("checkLastName").style.display = "none";
    document.getElementById("checkPassword").style.display = "none";
    document.getElementById("checkRole").style.display = "none";
    document.getElementById("checkNameDepartment").style.display = "none";
}

function addAccount() {

    // get data
    var username = document.getElementById("username").value;
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var password = document.getElementById("password").value;
    console.log(password)
    var role = document.getElementById("role").value;

    var nameDepartment = document.getElementById("nameDepartment").value;

    // TODO validate
    // then fail validate ==> return;
    if (!username || username.length < 5 || username.length > 50 || !firstName || firstName.length > 25 || !lastName || lastName.length > 25 || !password || password.length < 5 || password.length > 30 || !role || !nameDepartment) {
        resetCheckError();
        if ( !username) {
            document.getElementById("checkUsername").style.display = "block"
            document.getElementById("checkUsername").innerHTML = "Username not null "

        }
        if (username.length < 6|| username.length > 30) {
            document.getElementById("checkUsername").style.display = "block"
            document.getElementById("checkUsername").innerHTML = "Username from 6-50 character "

        }
        if (!lastName || lastName.length > 25) {
            document.getElementById("checkLastName").style.display = "block"
            document.getElementById("checkLastName").innerHTML = "LastName from 1-25 character "

        }
        if (!firstName || firstName.length > 25) {
            document.getElementById("checkFirstName").style.display = "block"
            document.getElementById("checkFirstName").innerHTML = "Firstname from 1-25 character "

        }
        if (!password || password.length > 30 || password.length < 6) {
            document.getElementById("checkPassword").style.display = "block"
            document.getElementById("checkPassword").innerHTML = "Password from 6-30 character "

        }
        if (!role) {
            document.getElementById("checkRole").style.display = "block"
            document.getElementById("checkRole").innerHTML = "Role not null "

        }
        if (!nameDepartment) {
            document.getElementById("checkNameDepartment").style.display = "block"
            document.getElementById("checkNameDepartment").innerHTML = "DepartmentName not null "

        }
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/accounts/username/" + username,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
        },
        success: function (data, textStatus, xhr) {
            console.log(data);
            // success
            // hideModal();
            // showSuccessAlert();
            // resetTableDepartment();
            // buildTable();

            if (data) {
                document.getElementById("checkUsername").style.display = "block"
                document.getElementById("checkUsername").innerHTML = "UserName exists!"



            }
            else {
                var account = {
                    username: username,
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                    role: role,
                    nameDepartment: nameDepartment
                };


                $.ajax({
                    url: 'http://localhost:8080/api/v1/accounts/save',
                    type: 'POST',
                    data: JSON.stringify(account), // body
                    contentType: "application/json", // type of body (json, xml, text)
                    // dataType: 'json', // datatype return
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
                    },
                    success: function (data, textStatus, xhr) {
                        console.log(data);
                        // success
                        hideModalAccount();
                        showSuccessAlert();
                        // resetDeleteCheckbox();
                        resetTable();

                        buildTableAccount();
                    },
                    error(jqXHR, textStatus, errorThrown) {
                        alert("Error when loading data");
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
            }



        },
        error(jqXHR, textStatus, errorThrown) {
            alert("Error when loading data");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });



}
function saveAccount() {
    var id = document.getElementById("id").value;

    if (id == null || id == "") {
        addAccount();
    } else {
        updateAccount();
    }
}
function updateAccount() {
    var id = document.getElementById("id").value;
    var username = document.getElementById("username").value;
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;

    var password = document.getElementById("password").value;
    var role = document.getElementById("role").value;

    var nameDepartment = document.getElementById("nameDepartment").value;
    console.log(id);
if(nameDepartment==""){
    nameDepartment="";
}

    // TODO validate
    // then fail validate ==> return;


    if (!username || username.length < 6 || username.length > 50 || !firstName || firstName.length > 25 || !lastName || lastName.length > 25) {
        resetCheckError();

        if (username.length < 6 || !username || username.length > 50) {
            document.getElementById("checkUsername").style.display = "block"
            document.getElementById("checkUsername").innerHTML = "Username from 6-50 character "

        }
        if (!lastName || lastName.length > 25) {
            document.getElementById("checkLastName").style.display = "block"
            document.getElementById("checkLastName").innerHTML = "LastName from 1-25 character "

        }
        if (!firstName || firstName.length > 25) {
            document.getElementById("checkFirstName").style.display = "block"
            document.getElementById("checkFirstName").innerHTML = "Firstname from 1-25 character "

        }

        return;
    }
    if (oldUsername == username) {
        var account = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            password: password,
            role: role,
            nameDepartment: nameDepartment
        };

        $.ajax({
            url: 'http://localhost:8080/api/v1/accounts/update/' + id,
            type: 'PUT',
            data: JSON.stringify(account), // body
            contentType: "application/json", // type of body (json, xml, text)
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
            },
            // dataType: 'json', // datatype return
            success: function (data, textStatus, xhr) {
                console.log(data);
                // success
                hideModalAccount();
                showSuccessAlert();
                resetTable();
                buildTableAccount();
            },
            error(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
        // hideModalAccount();
        // showSuccessAlert();
        // //resetTable();
        // buildTableAccount();
    }
    $.ajax({
        url: 'http://localhost:8080/api/v1/accounts/username/' + username,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
        },
        // dataType: 'json', // datatype return
        success: function (data, textStatus, xhr) {
            console.log(data);
            if (data) {
                document.getElementById("checkUsername").style.display = "block"
                document.getElementById("checkUsername").innerHTML = "UserName exists!"

            }
            else {
                var account = {
                    username: username,
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                    role: role,
                    nameDepartment: nameDepartment
                };

                $.ajax({
                    url: 'http://localhost:8080/api/v1/accounts/update/' + id,
                    type: 'PUT',
                    data: JSON.stringify(account), // body
                    contentType: "application/json", // type of body (json, xml, text)
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
                    },
                    // dataType: 'json', // datatype return
                    success: function (data, textStatus, xhr) {
                        console.log(data);
                        // success
                        hideModalAccount();
                        showSuccessAlert();
                        resetTable();
                        buildTableAccount();
                    },
                    error(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });

            }
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });


}

function openConfirmDeleteAccount(id) {
    // get index from employee's id
    var index = accounts.findIndex(x => x.id == id);
    var username = accounts[index].username;

    var result = confirm("Want to delete " + username + "?");
    if (result) {
        deleteAccount(id);
    }
}
function deleteAccount(id) {
    // TODO validate

    //call api
    $.ajax({
        url: 'http://localhost:8080/api/v1/accounts/delete/' + id,
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
        },
        success: function (result) {
            // error
            if (result == undefined || result == null) {
                alert("Error when loading data");
                return;
            }

            // success
            showSuccessAlert();
            resetTable();
            buildTableAccount();
        }
    });
}
function resetDeleteCheckbox() {
    document.getElementById("checkbox-all").checked = false;
    //rest iteam
    var i = 0;
    while (true) {
        var checkboxIteam = document.getElementById("checkbox-" + i)
        if (checkboxIteam !== undefined && checkboxIteam !== null) {
            checkboxIteam.checked = false;

            i++;
        }
        else {
            break;
        }
    }
}
function onChangeCheckboxIteam() {

    var i = 0;
    while (true) {
        var checkboxIteam = document.getElementById("checkbox-" + i)
        if (checkboxIteam !== undefined && checkboxIteam !== null) {
            if (!checkboxIteam.checked) {
                document.getElementById("checkbox-all").checked = false;
                return;
            }

            i++;
        }
        else {
            break;
        }
    }
    document.getElementById("checkbox-all").checked = true;


}
function onChangeCheckboxAll() {

    var i = 0;
    while (true) {
        var checkboxIteam = document.getElementById("checkbox-" + i)
        if (checkboxIteam !== undefined && checkboxIteam !== null) {

            checkboxIteam.checked = document.getElementById("checkbox-all").checked


            i++;
        }
        else {
            break;
        }

    }
}
function deleteAllAccount() {

    //get checked
    var ids = [];
    var usernames = [];
    var i = 0;
    while (true) {
        var checkboxIteam = document.getElementById("checkbox-" + i)
        if (checkboxIteam !== undefined && checkboxIteam !== null) {
            if (checkboxIteam.checked) {

                ids.push(accounts[i].id);
                usernames.push(accounts[i].username);


            }

            i++;
        }
        else {
            break;
        }

    }
    console.log(ids);

    //open confirm 

    var result = confirm("Want to delete " + usernames + "?");
    if (result) {

        $.ajax({
            url: 'http://localhost:8080/api/v1/accounts/delete?ids=' + ids,
            type: 'DELETE',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
            },
            success: function (result) {
                // error
                if (result == undefined || result == null) {
                    alert("Error when loading data");
                    return;
                }

                // success
                showSuccessAlert();
                resetTable();
                buildTableAccount();
            }
        });
    }
}


function hideModalAccount() {
    $('#myModalAccount').modal('hide');
}
