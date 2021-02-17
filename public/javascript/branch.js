const branch = document.getElementById('branch'), arr = ['Branch 1', 'Branch 2', 'Branch 3', 'Branch 3']

for (let i = 0; i < arr.length; i++) {
    const option = document.createElement('Option'), txt = document.createTextNode(arr[i])
    option.appendChild(txt);
    option.setAttribute("value", arr[i]);
    branch.insertBefore(option, branch.lastChild);
}