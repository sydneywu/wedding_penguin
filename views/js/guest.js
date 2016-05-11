<script type="text/ng-template" id="/guests.html">
  <div class="page-header">
    <h1>Wedding Penguin</h1>
  </div>

  <div class="left-bar col-sm-4">
			<form ng-submit="addGuest()">
				<h3>Add a new guest</h3>
				<div class="form-group">
				
					<input type="text" class="form-control" placeholder="Guest's Name" ng-model="guestName">
					
					<input type="text" class="form-control" placeholder="Relation" ng-model="guestRelation">

					<select name='table' ng-model="guestTable">
						<option ng-repeat="i in getNumber(totalTables) track by $index"> {{$index+1}}</option>
					</select>
				
					<button type="submit" class="btn btn-primary">Add</button>
				
				</div>
			</form>
			<button type="submit" ng-click="open()"class="btn btn-primary">Number of Tables</button>
		</div>
		
		
		<div class="right-bar col-sm-8" ng-controller="MainCtrl">
			

				<div ng-repeat="(key, value) in (guests| groupBy: 'table')">
						<h5> Table {{key}} </h5>
						<table class="table table-bordered table-responsive">
							<tr>
								<th style="width: 80px;"> Name </th>
								<th style="width: 20px;"> Table </th>
								<th style="width: 80px;"> Relation </th>
								<th style="width: 40px"></th>
								<th style="width: 40px"></th>
							</tr>
							<tr ng-repeat="guest in value">
								<td style="width: 80px;"><a href="#/guests/{{guest._id}}">{{guest.name}}</a></td>
								<td style="width: 20px;">{{guest.table}}</td>
								<td style="width: 80px;">
									<span ng-click="changeGuest(guest)">+</span>
									{{guest.relation}}
								</td>
								<td><a ng-click="editGuest(guest.id)" class="btn btn-small btn-primary">edit</a></td>
								<td><a ng-click="deleteGuest(guest.id)" class="btn btn-small btn-primary">delete</a></td>
							</tr>
							<br>
						</table>
					
				</div>

		</div>
</script>

<script type="text/ng-template" id="/guest_details.html">
	<div class="container">
	    <h1>Guest detail</h1>

	    <form ng-submit="updateGuest()">
			<h3>Update new guest</h3>
			<div class="form-group">
			
				<input type="text" class="form-control" placeholder="Guest's Name" ng-model="guest.name">
				
				<input type="text" class="form-control" placeholder="Relation" ng-model="guest.relation">

				<input type="text" class="form-control" placeholder="Table" ng-model="guest.table">
			
				<button type="submit" class="btn btn-primary">Add</button>

			
			</div>
		</form>

		<a ng-click="deleteGuest()" class ="btn btn-primary btn-small"> Delete Guest </a>

	</div>
</script>