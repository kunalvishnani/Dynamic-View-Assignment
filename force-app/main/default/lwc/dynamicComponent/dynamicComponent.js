import { LightningElement} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getData from '@salesforce/apex/GetObjectdata.getData';
import deleteObject from '@salesforce/apex/GetObjectdata.deleteObject';
import getSobject from '@salesforce/apex/GetObjectdata.getSobject';
import getEditableFields from '@salesforce/apex/GetObjectdata.getEditableFields';
import { NavigationMixin } from 'lightning/navigation';
const actions = [
    { label: 'View', name: 'View' },
    { label: 'Edit', name: 'Edit' },
    { label: 'Delete', name: 'Delete' },
];
export default class DynamicComponent extends NavigationMixin(LightningElement)
 
{
    totalSize=0;
    objectType;
    selectedSobject='';
    defaultObjectOptions=[];
    selectedRowsSize = 0;
    selectedRows = [];
    button='';
    columns=[];
    try1;
    results;
    ids;
    newDisplay=[];
    allSobject=[];
    defaultOptions=[];
    viewData=[];
    tempData=[];
    editableFields;
    tempColumns=[];
    recordToDisplay=5;
    recordDisplay=[];
    idCount=5;
    totalPages;
    pageNumber = [];
    tempCheck;
    currentButton;
    currentPage;
    variant="";
    objectModal = false;
    editModal = false;
    typee;
    options=[{label: 5, value: 5 },
            {label: 10, value: 10 }
            ]
    modalOpen=false;
    lstTabs = [
        {
            Id: 1,
            Name: 'Account'
        },
        {
            Id: 2,
            Name: 'Contact'
        },
        {
            Id: 3,
            Name: 'Lead'
        },
        {
            Id: 4,
            Name: 'Opportunity'
        },
        {
            Id: 5,
            Name: 'More'
        },
    ];
    renderedCallback1()
    {
        console.log('yessssssss');
        console.log(this.objectType);
        this.getNewData(this.objectType);
    }
    connectedCallback()
    {
        getSobject()
                .then(result => {
                   
                   
                   for(var i = 0 ;i<result.length ; i++)
                   {
                        this.allSobject.push({label: result[i] , value: result[i]});
                   }
                   console.log(this.allSobject );
                })
    }
    handleTabChange(event)
    {
        var values = event.target.label;
        this.objectType = values;
        if(values == 'More')
        {
            this.objectModal = true;
        }
        else{
        console.log(values);

        this.button = 'New '+values;
        this.typee = values;
        this.getNewData(values);
        }
    }

    getNewData(type)
    {
        //result=[];
            getData({ objectType: type })
                .then(result => {
                    if(result.length!=0)
                    {
                    console.log(result);
                    //console.log(Object.keys(result[0]));
                      this.columns = [
                        {label: Object.keys(result[0])[0], fieldName: Object.keys(result[0])[0]},
                        {label: Object.keys(result[0])[6], fieldName: Object.keys(result[0])[1]},
                        {label: Object.keys(result[0])[2], fieldName: Object.keys(result[0])[2]},
                        {label: Object.keys(result[0])[3], fieldName: Object.keys(result[0])[3]},
                        {label: Object.keys(result[0])[4], fieldName: Object.keys(result[0])[4]},
                        {
                            type: 'action',
                            typeAttributes: { rowActions: actions },
                        },
                    ]
                    this.tempData = this.columns;
                    this.defaultOptions=[Object.keys(result[0])[0],Object.keys(result[0])[6],Object.keys(result[0])[2],Object.keys(result[0])[3],Object.keys(result[0])[4]]
                    for(var i=0;i<Object.keys(result[0]).length;i++)
                    {
                      //console.log(Object.keys(result[0])[i]);
                      this.viewData.push(   { value: String(Object.keys(result[0])[i]), label: String(Object.keys(result[0])[i]) }  );
                    }
                    this.newDisplay = this.defaultOptions;
                    this.results = result;
                    this.recordDisplay = this.results.slice(0,this.recordToDisplay);
                    this.totalSize = result.length;
                    this.totalPages = Math.ceil(this.totalSize / this.recordToDisplay);
                    console.log(this.totalPages);
                    
                    this.pageNumber=[];
                    this.tempCheck=1;
                    for(var i=1;i<=this.totalPages ; i++)
                    {
                        this.pageNumber.push(i);
                        if(i==3)
                        break;
                    }
                    var button = this.template.querySelectorAll("lightning-button");
                    button.forEach(bun => {
                        console.log(bun.label);
                        var c = bun;
                        if(bun.label==1)
                        {
                            console.log('yess1');
                            bun.variant = "Brand";
                        }
                        else if(bun.label == 'Delete Selected')
                        {
                            console.log('yesssinelse');
                            console.log(this.button);
                        }
                        else if(bun.label == this.button)
                        {
                            console.log('yesssin2ndelse');
                            bun.variant="Brand";
                        }
                        else
                        {
                            bun.variant="";
                            console.log(bun.label);
                        }
                        
                       
                    })
                }
                else
                {
                    this.columns=[];
                    this.totalSize = 0;
                    console.log('yess in else');
                }
                })
                .catch(error => {
                    
                });

                
    }

    getSelectedName(event)
    {
        console.log(event.detail.selectedRows);
        this.selectedRows = event.detail.selectedRows;
        this.selectedRowsSize = this.selectedRows.length;
    }
    handleClose()
    {
        this.modalOpen = false;

        if(this.tempColumns.length !=0)
            this.columns = this.tempColumns;
    }
    
    listOptions = this.viewData;


    handleChange(event) {
        // Get the list of the "value" attribute on all the selected options
        var selectedOptionsList = event.detail.value;
        console.log(this.columns);
        this.tempColumns = this.columns;
        this.columns=[];
        for(var i  = 0; i<selectedOptionsList.length ; i++)
        {
            this.columns.push({ label: selectedOptionsList[i], fieldName: selectedOptionsList[i] });
        }
        this.columns.push({
            type: 'action',
            typeAttributes: { rowActions: actions },
        },);
        this.newDisplay = selectedOptionsList;
        
        console.log(this.tempColumns);
        console.log('Options selected: ${selectedOptionsList}');
    }

    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.modalOpen = true;
    }

    handleSave()
    {
        this.defaultOptions=[];
        this.defaultOptions = this.newDisplay;
        this.modalOpen = false;
    }

    navigateToNewRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: this.objectType,
                actionName: 'new'
            }
        });
        this.getNewData(this.objectType);
    }

    handleRowAction( event ) {

        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch ( actionName ) {
            //in case of  view
            case 'View':
                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view',
                    },
                }).then(url => {
                     window.open(url);
                });
                break;

                //in case of edit
            case 'Edit':
                // this[NavigationMixin.Navigate]({
                //     type: 'standard__recordPage',
                //     attributes: {
                //         recordId: row.Id,
                //         objectApiName: this.RelatedObject,
                //         actionName: 'edit'
                //     }
                    
                // });
                // //this.results=[];
                // this.getNewData(this.objectType);
                getEditableFields({ objectType: this.typee })
                .then(result => {
                    this.editableFields = result;
                    console.log(this.editableFields);
                    this.ids = row.Id;
                    console.log('idss'+this.ids);
                    this.getData(this.typee);
                    });
                this.editModal = true;
                break;
            case 'Delete':
                var temp = [];
                temp.push(row);
                console.log(temp)
                deleteObject({ objectList: temp , objectType : this.objectType})
                .then(result => {
                    this.results=[];
                    this.getNewData(this.objectType);
                    const evt = new ShowToastEvent({
                        title: 'Deleted SuccessFull',
                        message: this.objectType+' Deleted',
                        variant: 'success',
                    });
                    this.dispatchEvent(evt);
                })
                break;
            default:
        }
    }
    handleDelete()
    {
        deleteObject({ objectList: this.selectedRows , objectType : this.objectType})
                .then(result => {
                    this.results=[];
                    this.getNewData(this.objectType);
                    const evt = new ShowToastEvent({
                        title: 'Deleted SuccessFull',
                        message: this.objectType+'s Deleted',
                        variant: 'success',
                    });
                    this.dispatchEvent(evt);
                })
       
    }

    handleComboChange(event)
    {
        console.log(event.target.value);
        this.recordToDisplay=parseInt(event.target.value);
        this.recordDisplay = this.results.slice(0,this.recordToDisplay);
        this.totalPages = Math.ceil(this.totalSize / this.recordToDisplay);
        this.pageNumber=[];
        for(var i=1;i<=this.totalPages ; i++)
        {
            this.pageNumber.push(i);
            if(i==3)
            break;
        }
        console.log(this.recordDisplay);
        var button = this.template.querySelectorAll("lightning-button");
                    button.forEach(bun => {
                        console.log(bun.label);
                        var c = bun;
                        if(bun.label==1)
                        {
                            console.log('yess1');
                            bun.variant = "Brand";
                        }
                        else if(bun.label == 'Delete Selected')
                        {
                            console.log('yesssinelse');
                            console.log(this.button);
                        }
                        else if(bun.label == this.button)
                        {
                            console.log('yesssin2ndelse');
                            bun.variant="Brand";
                        }
                        else
                        {
                            bun.variant="";
                            console.log(bun.label);
                        }
                        
                       
                    })
    }

    openObjectModal()
    {
        this.objectModal = true;
        
    }

    handleObjectChange(event)
    {
        this.selectedSobject = event.target.value;
        console.log(this.selectedSobject);

    }

    handleSobjectClose()
    {
        this.objectModal = false;
    }
    handleSobjectSave()
    {
        this.objectModal = false;
        var temp = [];

        for(var i = 0 ; i<this.lstTabs.length-1 ; i++)
        {
            temp.push(this.lstTabs[i]);
            this.idCount = i;
        }
        temp.push({id: ++this.idCount , Name: this.selectedSobject});
        temp.push({id: ++this.idCount , Name: 'More'});
        this.lstTabs = temp;

    }

    handleRight()
    {
        if(this.totalPages > 3 && this.pageNumber[this.pageNumber.length-1] != this.totalPages)
        {
            console.log(this.totalPages + 'total');
            console.log(this.pageNumber[this.pageNumber.length-1] != this.totalPages+'lasttt ');
            this.pageNumber = [];
            var k = 0;
            this.tempCheck++;
            for(var i = this.tempCheck ; i<=this.recordToDisplay+1 ; i++)
            {   
                k+=1;
                this.pageNumber.push(i);
                if(k==3)
                break;
                
            }
            console.log("yesssss"+this.tempCheck);
            
        }
    }
    handleLeft()
    {
        if(this.pageNumber[0]!=1)
        {
        this.pageNumber = [];
            var k = 0;
            for(var i = this.tempCheck-- ; i<=this.recordToDisplay ; i++)
            {   
                k+=1;
                this.pageNumber.push(i);
                if(k==3)
                break;
            }
        }
    }
    setRecords(event)
    {
        this.variant = 'Brand';
        console.log('In Set');
        var page = parseInt(event.target.label);
        console.log(page);
        this.recordDisplay = [];
        this.recordDisplay = this.results.slice(parseInt((page-1)*this.recordToDisplay),(parseInt((page-1)*this.recordToDisplay))+parseInt(this.recordToDisplay));
        console.log(parseInt((page-1)*this.recordToDisplay)+'      '+((parseInt((page-1)*this.recordToDisplay))+parseInt(this.recordToDisplay)));
        console.log(this.results.slice(parseInt((page-1)*this.recordToDisplay),(parseInt((page-1)*this.recordToDisplay))+parseInt(this.recordToDisplay)));
        this.currentPage = page;
        var button = this.template.querySelectorAll("lightning-button");
        console.log('--------------');
        console.log(button);
        if(this.currentButton != null)
        {
            console.log('button');
            this.currentButton.variant='';
            
        }
        button.forEach(bun => {
            if(bun.label == page)
            {
                this.currentButton = bun;
                bun.variant="Brand";
                console.log('Current '+this.currentButton.label);
                try1 = this.currentButton.label;
            }
            
            else if(bun.label == 'Delete Selected')
                {
                    console.log('yesssinelse');
                    console.log(this.button);
                }
                else if(bun.label == this.button)
                {
                    console.log('yesssin2ndelse');
                    bun.variant="Brand";
                }
                else
                {
                    bun.variant="";
                    console.log(bun.label);
                }
        })
    }

    
    handleCancleForm()
    {
        this.editModal = false;
    }
    handleEditSave(event)
    {

       event.preventDefault();

       this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);

       this.editModal = false;

       this.dispatchEvent(new ShowToastEvent({
           title: 'Success!!',
           message: this.typee+' Update Successfull',
           variant: 'success'
       }),);
    }

    handleRefresh()
    {
        this.results=[];
        this.recordDisplay=[];
        this.getNewData(this.typee);
    }
    
}
