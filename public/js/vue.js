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
      $.getJSON("api/Orders", (resData) => {
        this.items = resData;
      });
    },
    editOrCreateOrder: function () {
      var url = "";
      var newOrder = {
        "Order Quantity": parseInt($("#OrderQuantity").val()),
        "Unit Price": parseFloat($("#UnitPrice").val()),
        "Customer Name": $("#CustomerName")
          .val()
          .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ""),
        "Order ID": parseInt($("#OrderId").val()),
        "Order Date": new Date(),
        "Product Category": "",
        Profit:0,
        Sales:0,
        "Ship Mode": "",
      };

      if (!newOrder["Customer Name"]) {
        M.toast({
          html: "Customer Name is Required!",
          classes: "red yellow-text",
        });
        return;
      }

      if (!$("#ID").val()) {
        newOrder["Order Id"]= 1;
        url = "api/newOrder";
      } else {
        newOrder.id = $("#ID").val();
        url = "api/UpdateOrder";
      }

      $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(newOrder),
        contentType: "application/json",
        success: (data) => {
          var instance = M.Modal.getInstance($("#EditOrderModal"));
          instance.close();
        },
        error: (jqXHR, textStatus, errorThrown) => {
          var instance = M.Modal.getInstance($("#EditOrderModal"));
          instance.close();
          M.toast({ html: jqXHR.responseText, classes: "red yellow-text" });
        },
      });
    },
    editItem: function (id) {
      $.ajax({
        type: "Get",
        url: "api/EditOrder",
        contentType: "application/json",
        data: { id },
        success: (data) => {
          $("#ModalHeader").text(
            `Edit - ${data["Customer Name"].replace(
              /[&\/\\#,+()$~%.'":*?<>{}]/g,
              ""
            )}`
          );

          console.log(data);
          $("#UnitPrice").val(formatter.format(data["Unit Price"]));
          $("#OrderQuantity").val(data["Order Quantity"]);
          $("#CustomerName").val(data["Customer Name"]);
          $("#OrderId").val(data["Order ID"]);
          $("#ID").val(data.id);
          $("#AddUpdateText").text("Update");
          var instance = M.Modal.getInstance($("#EditOrderModal"));
          M.updateTextFields();
          instance.open();
        },
        error: (jqXHR, textStatus, errorThrown) => {
          M.toast({ html: jqXHR.responseText, classes: "red yellow-text" });
        },
      });
    },
    updateOrder: function (newOrder) {
      if (newOrder.old_val != null) {
        var index = this.items.findIndex((x) => x.id == newOrder.old_val.id);
        if (newOrder.new_val == null) {
          Vue.delete(this.items, index);
        } else {
          Vue.set(this.items, index, newOrder.new_val);
        }
      } else {
        var OrderToAdd = newOrder.new_val;
        this.items.push(OrderToAdd);
      }
    },
    removeElement: function (id) {
      $.ajax({
        type: "POST",
        url: "api/DeleteOrder?" + $.param({ id }),
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
      var filteredList = this.items.filter(function (Order) {
        return (
          Order["Customer Name"].toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
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
          this.items = _.orderBy(this.items, "Unit Price", "asc");
          break;
        case "DescendingPrice":
          this.items = _.orderBy(this.items, "Unit Price", "desc");
          break;
        case "AToZ":
          this.items = _.orderBy(this.items, "Customer Name", "asc");
          break;
        case "ZToA":
          this.items = _.orderBy(this.items, "Customer Name", "desc");
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
