
ko.bindingHandlers.DynamicValue = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var Type = "", Prop = null, value = null;
        if (allBindings()) {
            if (allBindings().Type) { Type = allBindings().Type; }
            if (allBindings().Prop) { Prop = allBindings().Prop; }
        }

        if (Prop) { value = valueAccessor()[Prop]; }
        else { value = valueAccessor(); }

        var bind = {};
        switch (Type.toLowerCase()) {

            case 'int': bind = { Int: value }; break;
            case 'decimal': bind = { Decimal: value }; break;

            case 'time': bind = { time: value }; break;
            case 'date': bind = { date: value }; break;
            case 'datetime': bind = { datetime: value }; break;

            //case 'template':
            //    debugger;
            //    bind = { template: Prop }; break;

            default:
                if ($(element).is('input')) { bind = { value: value }; }
                else { bind = { text: value }; }
                break;
        }

        ko.applyBindingsToNode(element, bind);
    }
}

function KoGrid(searchUrl, sc) {
    var self = this;

    self.SC = ko.viewmodel.fromModel(sc);
    self.List = ko.observableArray([]);
    self.GridColumns = ko.observableArray([]);
    self.List.Paging = ko.observableArray([]);

    self.GoToPage = function (pageIndex) {
        self.SC.PageIndex(pageIndex);
        self.Search();
    }
    self.SwitchSort = function (colName) {
        if (self.SC.SortColumn() == colName) { self.SC.SortAsc(!self.SC.SortAsc()); }
        else { self.SC.SortColumn(colName); }

        self.Search();
    }

    self.GridColumns.SettingsId = Date.create().format('{hh}_{mm}_{ss}_{ms}' + "_" + Math.floor((Math.random() * 100)));
    self.GridColumns.Allowed = ko.observable(false);
    self.GridColumns.Count = ko.computed(function () { return self.GridColumns().filter(o => o.ViewOrder() != -1 && o.ViewOrder() != 99999).length; }, self.GridColumns);

    self.GridColumns.ResetOrder = function () {
        ko.utils.arrayForEach(self.OrderdGridColumns(), function (col, indx) { col.ViewOrder(indx); });
    }

    self.OrderdGridColumns = ko.computed(function () {
        return self.GridColumns().filter(o => o.ViewOrder() != -1 && o.ViewOrder() != 99999).sort((a, b) => a.ViewOrder() - b.ViewOrder());
    });
    self.UnOrderdGridColumns = ko.computed(function () {
        return self.GridColumns().filter(o => o.ViewOrder() == -1);
    });

    self.CurrentGridColumns = ko.computed(function () {
        return self.GridColumns().filter(o => o.ViewOrder() != -1).sort((a, b) => a.ViewOrder() - b.ViewOrder());
    });


    self.IsGridSearch = ko.observable(false);
    self.Search = function () {
        console.log(ko.toJSON(self.SC.From));
        self.List([]);
        self.List.Paging([]);
        self.IsGridSearch(true);
        $.ajax({
            url: searchUrl,
            type: "POST",
            contentType: "application/json",
            data: ko.toJSON(self.SC),
            success: function (result) {
                if (result && result.GridData) {

                    self.List(result.GridData);
                    self.SC.PageIndex(result.PageIndex);
                    self.SC.TotalRowCount(result.TotalRowCount);
                    self.SC.TotalPages(result.TotalPages);

                    var indx = result.PageIndex - 3;
                    if (indx < 0) { indx = 0; }
                    self.List.Paging(Array(result.TotalPages).fill().map((o, i) => i + 1).splice(indx, 5));
                    if (result.TotalRowCount > 0) {
                        $(".exportbtn").removeClass("disabled");
                    }
                    else {
                        $(".exportbtn").addClass("disabled");
                    }
                }
                self.IsGridSearch(false);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) { self.IsGridSearch(false); });
    }

    self.ExportUrl = null;
    self.Export = function () {
        if (self.ExportUrl) {

            $.ajax({
                url: self.ExportUrl + "Data",
                type: "Post",
                contentType: "application/json",
                data: ko.toJSON({ sc: self.SC, GridColumns: self.CurrentGridColumns().filter(o => o.ViewOrder() != 99999).map(o => o.Name) }),
                success: function (result) {
                    if (result != null) { console.log("ok"); window.open(self.ExportUrl + "/" + result, '_blank'); }
                },
                fail: function () { console.log("error"); }
            });
        }
    }
}


ko.bindingHandlers.date = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var value = ko.unwrap(valueAccessor());
        var dt = "";

        if ($(element).is('input')) {
            $(element).datepicker({
                onSelect: function (dateText) {
                    var observable = valueAccessor();
                    observable(Date.create(dateText));
                }
            });

        }

        //if (value) {
        //    dt = Date.create(value, 'ar').format("{MM}/{dd}/{yyyy}", "ar");

        //    if ($(element).is('input')) {
        //        valueAccessor()(Date.create(value, 'ar'));
        //        $(element).val(dt);
        //    }
        //    else { $(element).text(dt); }
        //}
        //else {
        //    if ($(element).is('input')) {
        //        valueAccessor()(null);
        //        $(element).val("");
        //    }
        //    else { $(element).text(""); }
        //}
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var value = ko.unwrap(valueAccessor());
        var dt = "";
        if (value) {

            dt = Date.create(value, 'ar').format("{MM}/{dd}/{yyyy}", "ar");

            if ($(element).is('input')) {
                valueAccessor()(Date.create(value, 'ar'));
                $(element).val(dt);
             

            }
            else { $(element).text(dt); }
        }
        else {
            if ($(element).is('input')) {
                valueAccessor()(null);
                $(element).val("");
            }
            else { $(element).text(""); }
        }
    }
}

ko.bindingHandlers.datetime = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var value = ko.unwrap(valueAccessor());
        var dt = "";

        if (value) {
            dt = Date.create(value, 'ar').format("{MM}/{dd}/{yyyy} - {HH}:{mm}", "ar")
        }

        if ($(element).is('input')) { $(element).val(dt); }
        else { $(element).text(dt); }
        console.log('dt');
        console.log(Date.create(value, 'ar'));

    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var value = ko.unwrap(valueAccessor());
        var dt = "";

        if (value) {
            dt = Date.create(value, 'ar').format("{MM}/{dd}/{yyyy} - {HH}:{mm}", "ar")
        }

        if ($(element).is('input')) { $(element).val(dt); }
        else { $(element).text(dt); }
    }
}
