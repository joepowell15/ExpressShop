const charBGColor = [
  "Bisque",
  "RoyalBlue",
  "LimeGreen",
  "linen",
  "Indigo",
  "Fuchsia",
  "Cornsilk",
  "Red",
];

var vm = new Vue({
  el: "#app",
  data: {
    currentPage: 1,
    pages: [],
    pageSize: 10,
    query: "",
    sortId: "",
    items: [],
    productCategories: [],
    selectedCategory: "(None)",
  },
  methods: {
    getItems: function () {
      $.getJSON("api/Orders", (resData) => {
        this.items = resData;
        this.productCategories = [
          ...new Set(_.sortBy(resData.map((x) => x["Product Category"]))),
        ];
        this.productCategories.map((val, index, array) => {
          if (val == "") {
            array[index] = "(None)";
          }
          $("#Cateogories").formSelect();
        });
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
        "Product Category": this.selectedCategory,
        Profit:
          parseInt($("#OrderQuantity").val()) *
          parseFloat($("#UnitPrice").val()) *
          0.9,
        Sales:
          parseInt($("#OrderQuantity").val()) *
          parseFloat($("#UnitPrice").val()),
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
        newOrder["Order Id"] = 1;
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
      }).always(() => {
        $("#Cateogories").prop("selectedIndex", 0);
        $("#Cateogories").formSelect();
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

          $("#UnitPrice").val(formatter.format(data["Unit Price"]));
          $("#OrderQuantity").val(data["Order Quantity"]);
          $("#Cateogories").val(data["Product Category"]);
          this.selectedCategory = data["Product Category"];
          $("#CustomerName").val(data["Customer Name"]);
          $("#OrderId").val(data["Order ID"]);
          $("#ID").val(data.id);
          $("#AddUpdateText").text("Update");
          var instance = M.Modal.getInstance($("#EditOrderModal"));
          $("#Cateogories").formSelect();
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
          Order["Customer Name"]
            .toLowerCase()
            .indexOf(vm.query.toLowerCase()) !== -1
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

var charts = new Vue({
  el: "#chartApp",
  data: {
    profitData: [],
    salesData: [],
    ordersPerCategoryData: [],
    ordersPerDayData: [],
    ordersPerDayChartContext: null,
    ordersPerCategoryContext: null,
    salesChartContext: null,
  },
  methods: {
    getProfitData: function () {
      $.getJSON("api/GetProfit", (resData) => {
        resData.map((obj, index, array) => {
          var initalValue = 0;

          if (this.profitData && this.profitData[index]) {
            initalValue = this.profitData[index].reduction;
          }

          anime({
            targets: obj,
            reduction: [initalValue, obj.reduction],
            easing: "linear",
            round: 1,
            duration: 1000,
          });
        });
        this.profitData = resData;
      });
    },
    getSalesData: function () {
      $.getJSON("api/GetSales", (resData) => {
        this.salesData = resData;
        this.createSalesChart();
      });
    },
    getOrdersPerDayData: function () {
      $.getJSON("api/OrdersPerDay", (resData) => {
        this.ordersPerDayData = resData;
        this.createOrdersPerDayChart();
      });
    },
    getOrdersPerCategoryData: function () {
      $.getJSON("api/CountPerProductCategory", (resData) => {
        this.ordersPerCategoryData = resData;
        this.createOrdersPerCategoryChart();
      });
    },
    createSalesChart: function () {
      this.salesChartContext = document
        .getElementById("SalesChart")
        .getContext("2d");
      var chart = new Chart(this.salesChartContext, {
        type: "bar",
        data: {
          labels: this.salesData.map((x) => x.group),
          datasets: [
            {
              label: "Sales Per Shipping Mode",
              backgroundColor: charBGColor,
              data: this.salesData.map((x) => x.reduction),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,

          scales: {
            yAxes: [
              {
                ticks: {
                  callback: function (value, index, values) {
                    return "$" + value;
                  },
                },
              },
            ],
          },
        },
      });
    },
    createOrdersPerCategoryChart: function () {
      this.ordersPerCategoryContext = document
        .getElementById("OrdersPerCategoryChart")
        .getContext("2d");
      var chart = new Chart(this.ordersPerCategoryContext, {
        type: "pie",
        fillOpacity: 0.3,
        data: {
          labels: this.ordersPerCategoryData.map((x) => x.group),
          datasets: [
            {
              label: "Orders Per Category",
              backgroundColor: charBGColor,
              data: this.ordersPerCategoryData.map((x) => x.reduction),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
    createOrdersPerDayChart: function () {
      for (let index = 0; index < this.ordersPerDayData.length; index++) {
        this.ordersPerDayData[index].group = new Date(
          this.ordersPerDayData[index].group
        );
      }

      this.salesChartContext = document
        .getElementById("OrdersPerDayChart")
        .getContext("2d");
      var chart = new Chart(this.salesChartContext, {
        type: "line",
        fillOpacity: 0.3,
        data: {
          labels: _.orderBy(this.ordersPerDayData, "group", "asc").map((x) =>
            x.group.toLocaleDateString("us")
          ),
          datasets: [
            {
              label: "Orders Per Day",
              data: _.orderBy(this.ordersPerDayData, "group", "desc").map(
                (x) => x.reduction
              ),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  precision: 0,
                  callback: function (value, index, values) {
                    return Math.round(value);
                  },
                },
              },
            ],
          },
        },
      });
    },
    updateData: function (newOrder) {
      this.getOrdersPerCategoryData();
      this.getOrdersPerDayData();
      this.getSalesData();
      this.getProfitData();
    },
  },
  watch: {
    salesData: () => {},
  },
  created() {
    this.getProfitData();
    this.getSalesData();
    this.getOrdersPerDayData();
    this.getOrdersPerCategoryData();
  },
  computed: {
    barHeight() {
      return this.chartHeight / this.salesData.length - 10;
    },
    dataMax() {
      return Math.max(...this.salesData.map((x) => x.reduction));
    },
  },
});
