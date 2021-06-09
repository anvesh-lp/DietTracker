//Item Controller
const ItemController = (function () {
    let calories = 0;
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    let totalCalories = 0;
//    Data Strucutre to handle items
    const data = {
        items: [/*{id: 1, name: 'dhal', calories: 200},
            {id: 2, name: 'chapathi', calories: 300},
            {id: 3, name: 'Omlet', calories: 400}*/],
        current: null
    }
    return {
        logData: function () {
            return data;
        },
        //to add item to the litst
        addItem: function (userData) {
            let id;
            if (data.items.length !== 0) {
                id = data.items[data.items.length - 1].id + 1;
            } else {
                id = 1;
            }
            let newUser = new Item(id, userData.name, parseInt(userData.item));
            data.items.push(newUser);
            totalCalories += parseInt(userData.item);
            return newUser;
        },
        //TO gettotalCalories
        getTotalCalories: function () {
            let totalCalories=0;
            data.items.forEach(function (item) {
                totalCalories+=item.calories;
            });
            return totalCalories;
        },
        //To update total Calories after users updates an item
        updateTotalCaloreis: function (operation, calories) {
            if (operation === 'add') {
                totalCalories += calories;
            } else if (operation === 'remove') {
                totalCalories -= calories;
            }
        },
        //    to Find an Element in data list using id
        findElementById: function (itemId) {
            let found = null;
            data.items.forEach(function (item) {
                if (item.id === itemId) {
                    // console.log(`find by id method ${item.name}, ${item.id},${item.calories}`);
                    found = item;
                }
            });
            // console.log(`find by id method ${found.name}, ${found.id},${found.calories}`);

            return found;

        },
        setCurrentItem: function (item) {
            // console.log(`find by id method ${item.name}, ${item.id},${item.calories}`);
            data.current = item;
        },
        //To update into Data
        updateItem: function (updatedItem) {
            totalCalories=0
            //    Current item is already set when user clicked on edit icon
            data.items.forEach(function (item) {
                if (item.id === data.current.id) {
                    item.name = updatedItem.name;
                    item.calories = updatedItem.item;
                }
                totalCalories+=item.calories;
            });
        },
        deleteItem : function (id) {
            let indexOfelement=0;
            data.items.forEach(function (item,index) {
                if (item.id===id){
                    indexOfelement=index;
                }
            });
            data.items.splice(indexOfelement,1);
            console.log(`Item at ${indexOfelement} is deleted`);
        },
        getCurrentItem:function (){
            return data.current;
        }

    }
})();

//Ui Controller

const Uicontroller = (function () {

    const UIElements = {
        itemList: 'item-list',
        addBtn: '.add-btn',
        itemname: '#item-name',
        calorieInput: "#item-calories",
        totalcalories: '.total-calories',
        updatebtn: '.update-btn',
        deletebtn: '.remove-btn',
        backbtn: '.back-btn',
        clearbtn:'.clear-btn'

    }

    return {
        populateDataToUi: function (data) {
            if (data.length===0){
                Uicontroller.hideList();
                this.hideEditState();
                this.clearFields();
            }else {
                this.hideEditState();
                this.clearFields();
                document.getElementById(UIElements.itemList).style.display = 'block';
                let html = ``;
                data.forEach(function (food) {
                    html += `<li class="collection-item" id="item-${food.id}">
            <strong>${food.name} : </strong><em>${food.calories} calories</em>
            <a href="" class="secondary-content">
                <i class="edit-item fa fa-pencil-alt"></i>
            </a>
        </li>`
                });
                document.getElementById(UIElements.itemList).innerHTML = html;
            }
        },
        //To get the elements from DOM
        getUiElements: function () {
            return UIElements;
        },
        //Getting inputs from the user
        getInputs: function () {
            return {
                name: document.querySelector(UIElements.itemname).value,
                item: parseInt(document.querySelector(UIElements.calorieInput).value)
            }
        },
        //clear fields after user enters the details
        clearFields: function () {
            document.querySelector(UIElements.itemname).value = '';
            document.querySelector(UIElements.calorieInput).value = '';
        },
        //    to hide ui list if list is empty
        hideList: function () {
            document.getElementById(UIElements.itemList).style.display = 'none';
        },
        unhideList: function () {
            document.getElementById(UIElements.itemList).style.display = 'block';
        },
        //TO show total calores in ui
        showTotalCalories: function (calories) {
            document.querySelector(UIElements.totalcalories).textContent = calories;
        },
        //Hides update ,delete and back button in UI
        hideEditState: function () {
            Uicontroller.clearFields();
            document.querySelector(UIElements.updatebtn).style.display = 'none';
            document.querySelector(UIElements.deletebtn).style.display = 'none';
            document.querySelector(UIElements.backbtn).style.display = 'none';
            document.querySelector(UIElements.addBtn).style.display = 'inline-block';

        },
        //TO auto populate item details int input fields after user clicks on edit icon
        updateItem: function (item) {
            document.querySelector(UIElements.itemname).value = item.name;
            document.querySelector(UIElements.calorieInput).value = item.calories;
        },
        //To show edit.remove buttons in ui after user clicks on edit button
        showEditState: function () {
            document.querySelector(UIElements.updatebtn).style.display = 'inline-block';
            document.querySelector(UIElements.deletebtn).style.display = 'inline-block';
            document.querySelector(UIElements.backbtn).style.display = 'inline-block';
            document.querySelector(UIElements.addBtn).style.display = 'none';

        }
    }
})();

//App controller

const App = (function (uicontroller, itemcontroller) {

    const loadEventListener = function () {
        const elements = uicontroller.getUiElements();
        //on clicking the add button(to add data to list)
        document.querySelector(elements.addBtn).addEventListener('click', addEntity);
        //Lister for edit even when user clicks on edit icon
        document.getElementById(elements.itemList).addEventListener('click', handleEditIcon);
        //    Listen for Update button when user clicks on update button
        document.querySelector(elements.updatebtn).addEventListener('click', handleUpdateButton);
    //    Listen for Back button when user clicks on back button
        document.querySelector(elements.backbtn).addEventListener('click',uicontroller.hideEditState);
    //    Listen for delete Item button
        document.querySelector(elements.deletebtn).addEventListener('click',handleDeleteButton);
    //    listen for clear all button
        document.querySelector(elements.clearbtn).addEventListener('click',handleClearButton);
    }



    //To handle clear al event lsitern when user clicks on clear button
    const handleClearButton= function (event) {
        itemcontroller.logData().items=[];
        uicontroller.populateDataToUi(itemcontroller.logData().items);

        const totalCalories = itemcontroller.getTotalCalories();
        //Show total calories
        uicontroller.showTotalCalories(totalCalories);
        event.preventDefault();
    }

    //To handle update button after user clicks it(saving the data into data and then displaying the update data in the list)
    const handleUpdateButton = function (event) {
        //Get new values from inputs
        const updatedItem = uicontroller.getInputs();
        //To update item in the itemcontroller
        itemcontroller.updateItem(updatedItem);
        //Display the updated list;
        uicontroller.populateDataToUi(itemcontroller.logData().items);

        const totalCalories = itemcontroller.getTotalCalories();
        //Show total calories
        uicontroller.showTotalCalories(totalCalories);

        event.preventDefault();
    }

    const handleDeleteButton=function (event) {
        //get id of current element
        const currentItem=itemcontroller.getCurrentItem();

        itemcontroller.deleteItem(currentItem.id);

        // console.log(`delete button : ${currentItem.id}`);

        uicontroller.populateDataToUi(itemcontroller.logData().items);

        const totalCalories = itemcontroller.getTotalCalories();
        //Show total calories
        uicontroller.showTotalCalories(totalCalories);



        event.preventDefault();

    }

    //Operation to happen when user clicks on edit icon
    const handleEditIcon = function (event) {
        //CHeck if user clicked on edit icon (using event delegation)
        if (event.target.classList.contains("edit-item")) {
            console.log("edit buttn clicked");
            //    Get id of item user clicked using unique id(item-0,item-1...)
            const i = parseInt((event.target.parentNode.parentNode.id).split("-")[1]);
            console.log(i);
            const foundItem = itemcontroller.findElementById(i);
            console.log(`find by id method ${foundItem.name}, ${foundItem.id},${foundItem.calories}`);
            //    set currentItem to foundItem
            itemcontroller.setCurrentItem(foundItem);
            //To autpopulate field in UI
            uicontroller.updateItem(foundItem);
            //    and display edit state after since he clicked edit option
            uicontroller.showEditState();

        }
        event.preventDefault();
    }

    const addEntity = function (event) {
        console.log("Button clicked");
        //get values from inputs(from ui controller
        const data = uicontroller.getInputs();
        if (data.item !== '' && data.name !== '') {
            console.log(data.item, data.name);
            itemcontroller.addItem(data);
            //    Displayin updated list
            uicontroller.clearFields();
            uicontroller.populateDataToUi(itemcontroller.logData().items);
            //Get total calories till now from Item Controller
            const totalCalories = itemcontroller.getTotalCalories();
            //Show total calories
            uicontroller.showTotalCalories(totalCalories);

        }

        event.preventDefault();
    }


    return {
        init: function () {
            uicontroller.hideEditState();

            if (itemcontroller.logData().items.length === 0) {
                uicontroller.hideList();
            } else {
                console.log(itemcontroller.logData());
                Uicontroller.populateDataToUi(itemcontroller.logData().items);
            }

            loadEventListener();
        }

    }
})(Uicontroller, ItemController);

App.init();