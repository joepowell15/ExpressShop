var data = [];

var vm = new Vue({
  el: "#app",
  data: {
    currentPage: 1,
    pages: [],
    pageSize: 10,
    query: "",
    sortId: "",
    items: data,
  },
  methods: {
    getItems: function () {
      $.getJSON("api/Items", (resData) => {
        this.items = resData;
      });
    },
    editOrCreateItem: function () {
      var url = "";
      var newItem = {
        UnitsInStock: parseInt($("#Units").val()),
        UnitPrice: parseFloat($("#Price").val()),
        ProductName: $("#ProductName")
          .val()
          .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ""),
        ProductID: parseInt($("#ProductID").val()),
        Discontinued: false,
      };

      if (!newItem.UnitPrice || !newItem.ProductName || !newItem.UnitsInStock) {
        M.toast({
          html: "Product Name is Required!",
          classes: "red yellow-text",
        });
        return;
      }

      if (!$("#ID").val()) {
        newItem.ProductID = 1;
        url = "api/newItem";
      } else {
        newItem.id = $("#ID").val();
        url = "api/UpdateItem";
      }

      $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(newItem),
        contentType: "application/json",
        success: (data) => {
          var instance = M.Modal.getInstance($("#EditItemModal"));
          instance.close();
        },
        error: (jqXHR, textStatus, errorThrown) => {
          var instance = M.Modal.getInstance($("#EditItemModal"));
          instance.close();
          M.toast({ html: jqXHR.responseText, classes: "red yellow-text" });
        },
      });
    },
    editItem: function (id) {
      $.ajax({
        type: "Get",
        url: "api/EditItem",
        contentType: "application/json",
        data: { id },
        success: (data) => {
          $("#ModalHeader").text(
            `Edit - ${data.ProductName.replace(
              /[&\/\\#,+()$~%.'":*?<>{}]/g,
              ""
            )}`
          );
          $("#Price").val(formatter.format(data.UnitPrice));
          $("#Units").val(data.UnitsInStock);
          $("#ProductName").val(data.ProductName);
          $("#ProductID").val(data.ProductID);
          $("#ID").val(data.id);
          $("#AddUpdateText").text("Update");
          var instance = M.Modal.getInstance($("#EditItemModal"));
          M.updateTextFields();
          instance.open();
        },
        error: (jqXHR, textStatus, errorThrown) => {
          M.toast({ html: jqXHR.responseText, classes: "red yellow-text" });
        },
      });
    },
    updateItem: function (newItem) {
      if (newItem.old_val != null) {
        var index = this.items.findIndex((x) => x.id == newItem.old_val.id);
        if (newItem.new_val == null) {
          Vue.delete(this.items, index);
        } else {
          Vue.set(this.items, index, newItem.new_val);
        }
      } else {
        var itemToAdd = newItem.new_val;
        this.items.push(itemToAdd);
      }
    },
    removeElement: function (id) {
      $.ajax({
        type: "POST",
        url: "api/DeleteItem?" + $.param({ id }),
        contentType: "application/json",
        success: (data) => {},
        error: (jqXHR, textStatus, errorThrown) => {
          M.toast({ html: jqXHR.responseText, classes: "red yellow-text" });
        },
      });
    },
    sortElements: function (id) {
      this.currentPage = 1;
      this.sortId = id;
    },
    getFilteredList: function () {
      var filteredList = this.items.filter(function (item) {
        return (
          item.ProductName.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
        );
      });

      return filteredList;
    },
    setPaging: function (filteredList) {
      var pageHolder = [];
      if (!filteredList.length) {
        this.pages = [{ index: 1, active: true }];
      } else {
        for (
          let index = 0;
          index < Math.ceil(filteredList.length / this.pageSize);
          index++
        ) {
          var oneBasedIndex = index + 1;
          pageHolder.push({
            index: oneBasedIndex,
            active: this.currentPage == oneBasedIndex,
          });
        }
        this.pages = pageHolder;
      }
    },
  },
  watch: {
    pageSize: function () {
      this.currentPage = 1;
    },
    sortId: function (newId) {
      switch (newId) {
        case "AscendingPrice":
          this.items = _.orderBy(this.items, "UnitPrice", "asc");
          break;
        case "DescendingPrice":
          this.items = _.orderBy(this.items, "UnitPrice", "desc");
          break;
        case "AToZ":
          this.items = _.orderBy(this.items, "ProductName", "asc");
          break;
        case "ZToA":
          this.items = _.orderBy(this.items, "ProductName", "desc");
          break;
        default:
            M.toast({ html: "Sort Not Found", classes: "red yellow-text" });
          break;
      }
    },
  },
  computed: {
    computedList: function () {
      var vueM = this;
      var startIndex = (this.currentPage - 1) * this.pageSize;
      var endIndex = this.currentPage * this.pageSize;
      var filteredList = this.getFilteredList();
      this.setPaging(filteredList);
      return filteredList.slice(startIndex, endIndex);
    },
  },
  mounted() {
    this.getItems();
  },
});
